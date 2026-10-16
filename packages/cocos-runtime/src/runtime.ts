import {
  Camera, Canvas, Color, DirectionalLight, EffectAsset, Graphics, Input, Label, Layers,
  LabelOutline, Material, Mesh, MeshRenderer, Node, UITransform, Vec3, Vec4,
  director, game, Game, input, primitives, resources, utils, view, ResolutionPolicy, sys,
  type EventKeyboard, type EventTouch,
} from 'cc';
import { createCocosPlatform } from 'db://assets/collection/platform/cocos-host';
import { cocosServices, CocosWebControls } from 'db://assets/collection/platform/cocos-services';

export const color = (hex: string) => new Color().fromHEX(hex);

/** Reusable Creator services. Game state remains in each game's pure core. */
export class GameView {
  readonly scene = director.getScene()!;
  readonly world = new Node('World');
  readonly camera: Camera;
  readonly canvas = new Node('HUD');
  readonly platform;
  readonly ready: Promise<void>;
  effect!: EffectAsset;
  readonly services = cocosServices(sys.isBrowser);
  readonly insets = this.services.insets();
  private readonly webControls = sys.isBrowser ? new CocosWebControls() : null;
  readonly materials = new Map<string, Material>();
  readonly meshes = new Map<string, Mesh>();
  readonly objects = new Map<string, Node>();
  readonly texts = new Map<string, Label>();
  readonly buttons = new Map<string, { node: Node; label: Label; action: () => void; width: number; height: number; accent: boolean }>();
  private readonly usedObjects = new Set<string>();
  private readonly usedTexts = new Set<string>();
  private readonly usedButtons = new Set<string>();
  width = 390;
  height = 844;
  onHide = () => {};
  onKey = (_key: EventKeyboard, _down: boolean) => {};
  onTouch = (_touch: EventTouch, _phase: 'start' | 'move' | 'end') => {};
  private readonly keyDown = (e: EventKeyboard) => this.onKey(e, true);
  private readonly keyUp = (e: EventKeyboard) => this.onKey(e, false);
  private readonly touchStart = (e: EventTouch) => this.onTouch(e, 'start');
  private readonly touchMove = (e: EventTouch) => this.onTouch(e, 'move');
  private readonly touchEnd = (e: EventTouch) => this.onTouch(e, 'end');
  private readonly hidden = () => this.onHide();
  private frameWidth = 0;
  private frameHeight = 0;

  constructor(key: string, background = '#233c59') {
    // Software WebGL CI advances simulation explicitly. Limit presentation work
    // there so queued GPU frames cannot starve real pointer/keyboard events.
    if (sys.isBrowser && (globalThis as { __COLLECTION_TEST__?: boolean }).__COLLECTION_TEST__) game.frameRate = 10;
    this.ready = new Promise((resolve, reject) => resources.load('collection/collection-color', EffectAsset, (error, effect) => {
      if (error) return reject(error);
      this.effect = effect; resolve();
    }));
    const frame = view.getFrameSize();
    view.setDesignResolutionSize(frame.width, frame.height, ResolutionPolicy.SHOW_ALL);
    view.resizeWithBrowserSize(true);
    this.world.parent = this.scene;
    // Clear the full window before a game narrows its world camera for a desktop HUD.
    const backgroundNode=new Node('Full-window background');backgroundNode.parent=this.scene;
    const backgroundCamera=backgroundNode.addComponent(Camera);backgroundCamera.priority=-1;
    backgroundCamera.visibility=0;backgroundCamera.clearFlags=Camera.ClearFlag.SOLID_COLOR;
    backgroundCamera.clearColor=color(background);
    const camNode = new Node('World Camera'); camNode.parent = this.scene;
    this.camera = camNode.addComponent(Camera);
    this.camera.clearColor = color(background);
    this.camera.near = .1; this.camera.far = 250;
    this.camera.fov = 43.43;
    this.camera.visibility = Layers.Enum.DEFAULT;
    camNode.setPosition(0, 21.4, 20.3); camNode.lookAt(new Vec3(0, 0, -7.1));
    const lightNode = new Node('Sun'); lightNode.parent = this.scene;
    lightNode.setRotationFromEuler(-50, -35, 0);
    const light = lightNode.addComponent(DirectionalLight); light.illuminance = 65000;
    this.scene.globals.ambient.skyColor = new Vec4(.65, .73, .85, 1);
    this.scene.globals.ambient.skyIllum = 20000;
    this.scene.globals.ambient.groundAlbedo = new Vec4(.3, .35, .43, 1);
    this.canvas.parent = this.scene; this.canvas.layer = Layers.Enum.UI_2D;
    this.canvas.addComponent(UITransform).setContentSize(390, 844);
    const ui = this.canvas.addComponent(Canvas);
    const uiCameraNode = new Node('UI Camera'); uiCameraNode.parent = this.scene;
    uiCameraNode.setPosition(195, 422, 1000);
    const uiCamera = uiCameraNode.addComponent(Camera);
    uiCamera.projection = Camera.ProjectionType.ORTHO;
    uiCamera.orthoHeight = 422; uiCamera.priority = 2;
    uiCamera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
    uiCamera.visibility = Layers.Enum.UI_2D;
    uiCamera.near = .1; uiCamera.far = 2000;
    ui.cameraComponent = uiCamera;
    this.platform = createCocosPlatform({ browser: sys.isBrowser, storage: sys.localStorage, onHide: callback => {
      game.on(Game.EVENT_HIDE, callback);
      return () => game.off(Game.EVENT_HIDE, callback);
    } }, key);
    input.on(Input.EventType.KEY_DOWN, this.keyDown);
    input.on(Input.EventType.KEY_UP, this.keyUp);
    input.on(Input.EventType.TOUCH_START, this.touchStart);
    input.on(Input.EventType.TOUCH_MOVE, this.touchMove);
    input.on(Input.EventType.TOUCH_END, this.touchEnd);
    input.on(Input.EventType.TOUCH_CANCEL, this.touchEnd);
    game.on(Game.EVENT_HIDE, this.hidden);
    this.resize();
  }

  resize() {
    const frame = view.getFrameSize();
    if (frame.width !== this.frameWidth || frame.height !== this.frameHeight) {
      this.frameWidth = frame.width; this.frameHeight = frame.height;
      view.setDesignResolutionSize(frame.width, frame.height, ResolutionPolicy.SHOW_ALL);
    }
    const size = view.getVisibleSize();
    this.width = size.width; this.height = size.height;
    this.canvas.getComponent(UITransform)!.setContentSize(this.width, this.height);
    // World and UI cameras have separate layers; the visible height stays 844.
    this.canvas.setPosition(this.width / 2, this.height / 2, 0);
    this.canvas.getComponent(Canvas)!.cameraComponent!.node.setPosition(this.width / 2, this.height / 2, 1000);
    this.canvas.getComponent(Canvas)!.cameraComponent!.orthoHeight = this.height / 2;
  }

  material(hex: string) {
    if (!this.materials.has(hex)) {
      const material = new Material();
      material.initialize(this.effect ? {effectAsset: this.effect} : { effectName: 'builtin-unlit' });
      material.setProperty('mainColor', color(hex));
      this.materials.set(hex, material);
    }
    return this.materials.get(hex)!;
  }

  shape(id: string, shape: 'box' | 'sphere' | 'cylinder' | 'cone', hex: string, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
    this.usedObjects.add(id);
    let node = this.objects.get(id);
    if (!node) {
      node = new Node(id); node.parent = this.world;
      const renderer = node.addComponent(MeshRenderer);
      if (!this.meshes.has(shape)) {
        const mesh = shape === 'sphere' ? primitives.sphere(.5, { segments: 10 })
          : shape === 'cylinder' ? primitives.cylinder(.5, .5, 1, { radialSegments: 10 })
            : shape === 'cone' ? primitives.cone(.5, 1, { radialSegments: 8 }) : primitives.box();
        this.meshes.set(shape, utils.createMesh(mesh));
      }
      renderer.mesh = this.meshes.get(shape)!;
      this.objects.set(id, node);
    }
    node.active = true;
    const renderer = node.getComponent(MeshRenderer)!;
    if (renderer.sharedMaterial !== this.material(hex)) renderer.setSharedMaterial(this.material(hex), 0);
    node.setPosition(x, y, z); node.setScale(sx, sy, sz);
    return node;
  }

  begin() {
    this.resize();
    this.usedObjects.clear(); this.usedTexts.clear(); this.usedButtons.clear();
  }

  text(id: string, value: string, x: number, y: number, size = 18, hex = '#ffffff', width = 360) {
    this.usedTexts.add(id);
    let label = this.texts.get(id);
    if (!label) {
      const node = new Node(id); node.parent = this.canvas; node.layer = Layers.Enum.UI_2D;
      node.addComponent(UITransform);
      label = node.addComponent(Label); label.fontFamily = 'Noto Sans CJK SC';
      label.overflow = Label.Overflow.SHRINK; label.horizontalAlign = Label.HorizontalAlign.CENTER;
      label.verticalAlign = Label.VerticalAlign.CENTER; label.enableWrapText = true;
      this.texts.set(id, label);
    }
    label.node.active = true; label.node.setPosition(x, y, 0);
    label.horizontalAlign=Label.HorizontalAlign.CENTER;label.isBold=false;
    label.node.setSiblingIndex(this.canvas.children.length - 1);
    label.node.getComponent(UITransform)!.setContentSize(width, size * 2.6);
    label.fontSize = size; label.lineHeight = size * 1.4;
    label.color = color(hex); if (label.string !== value) label.string = value;
    return label;
  }

  button(id: string, value: string, x: number, y: number, width: number, action: () => void, accent = false, height = 46) {
    this.usedButtons.add(id);
    let button = this.buttons.get(id);
    if (!button) {
      const node = new Node(id); node.parent = this.canvas; node.layer = Layers.Enum.UI_2D;
      node.addComponent(UITransform);
      const g = node.addComponent(Graphics); g.fillColor = color(accent ? '#159cfa' : '#203e5c');
      g.strokeColor = color(accent ? '#67d9ff' : '#49667f'); g.lineWidth = 1;
      g.roundRect(-width / 2, -height/2, width, height, 10); g.fill(); g.stroke();
      const textNode = new Node('Label'); textNode.parent = node; textNode.layer = Layers.Enum.UI_2D;
      textNode.addComponent(UITransform).setContentSize(width - 12, height-4);
      const label = textNode.addComponent(Label); label.fontSize = 14; label.lineHeight = 20;
      label.fontFamily = 'Noto Sans CJK SC';
      label.isBold = true;
      label.overflow = Label.Overflow.SHRINK;
      label.horizontalAlign = Label.HorizontalAlign.CENTER; label.verticalAlign = Label.VerticalAlign.CENTER;
      button = { node, label, action, width, height, accent }; this.buttons.set(id, button);
      node.on(Node.EventType.TOUCH_END, () => this.buttons.get(id)!.action());
    }
    button.node.getComponent(UITransform)!.setContentSize(width, height);
    if (width !== button.width || height !== button.height || accent !== button.accent) {
      const g = button.node.getComponent(Graphics)!; g.clear();
      g.fillColor = color(accent ? '#159cfa' : '#203e5c'); g.strokeColor = color(accent ? '#67d9ff' : '#49667f');
      g.roundRect(-width/2,-height/2,width,height,10); g.fill(); g.stroke();
      button.width = width; button.height = height; button.accent = accent;
      button.label.node.getComponent(UITransform)!.setContentSize(width-12,height-4);
    }
    button.node.active = true; button.node.setPosition(x, y, 0);
    button.node.setSiblingIndex(this.canvas.children.length - 1);
    button.label.node.active = true; button.label.string = value; button.action = action;
    return button.node;
  }

  worldText(id: string, value: string, point: Vec3, size = 18) {
    const projected = this.camera.convertToUINode(point, this.canvas);
    const label = this.text(id, value, projected.x, projected.y, size);
    label.isBold = true;
    if (!label.node.getComponent(LabelOutline)) {
      const outline = label.node.addComponent(LabelOutline); outline.color = color('#18334b'); outline.width = 2;
    }
  }

  meshNode(id: string, mesh: Mesh, material: Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
    this.usedObjects.add(id);
    let node = this.objects.get(id);
    if (!node) { node = new Node(id); node.parent = this.world; node.addComponent(MeshRenderer); this.objects.set(id, node); }
    node.active = true;
    const renderer = node.getComponent(MeshRenderer)!;
    if (renderer.mesh !== mesh) renderer.mesh = mesh;
    if (renderer.sharedMaterial !== material) renderer.setSharedMaterial(material, 0);
    node.setPosition(x, y, z); node.setScale(sx, sy, sz);
    return node;
  }

  panel(id: string, x: number, y: number, width: number, height: number, hex = '#102e49ee') {
    const key = `panel:${id}`;
    this.usedObjects.add(key);
    let node = this.objects.get(key);
    if (!node) {
      node = new Node(key); node.parent = this.canvas; node.layer = Layers.Enum.UI_2D;
      node.addComponent(UITransform).setContentSize(width, height);
      const g = node.addComponent(Graphics); g.fillColor = color(hex);
      g.roundRect(-width / 2, -height / 2, width, height, Math.min(16,width/2,height/2)); g.fill();
      this.objects.set(key, node);
    }
    const bounds = node.getComponent(UITransform)!;
    if (bounds.width !== width || bounds.height !== height) {
      bounds.setContentSize(width,height); const g=node.getComponent(Graphics)!;g.clear();g.fillColor=color(hex);
      g.roundRect(-width/2,-height/2,width,height,Math.min(16,width/2,height/2));g.fill();
    }
    node.active = true; node.setPosition(x, y, 0);
    node.setSiblingIndex(this.canvas.children.length - 1);
  }

  end(state: Record<string, unknown>) {
    for (const [id,node] of this.objects) if (!this.usedObjects.has(id)) node.active = false;
    for (const [id,label] of this.texts) if (!this.usedTexts.has(id)) label.node.active = false;
    for (const [id,button] of this.buttons) if (!this.usedButtons.has(id)) button.node.active = false;
    const controls = Array.from(this.buttons.entries()).filter(([,b]) => b.node.active).map(([id,b]) => ({
      id, label: b.label.string, x: b.node.position.x + this.width / 2, y: this.height / 2 - b.node.position.y,
      width: b.node.getComponent(UITransform)!.width, height: b.height, action: b.action,
    }));
    this.webControls?.sync(controls, this.width, this.height);
    const global = globalThis as unknown as {__COLLECTION_TEST__?: boolean; __collectionSnapshot?: unknown};
    if (global.__COLLECTION_TEST__) global.__collectionSnapshot = { ...state, width: this.width, height: this.height,
      controls: controls.map(({action, ...button}) => button), labels: Array.from(this.texts.values()).filter(t => t.node.active).map(t => t.string) };
  }

  destroy() {
    this.webControls?.destroy();
    input.off(Input.EventType.KEY_DOWN, this.keyDown); input.off(Input.EventType.KEY_UP, this.keyUp);
    input.off(Input.EventType.TOUCH_START, this.touchStart); input.off(Input.EventType.TOUCH_MOVE, this.touchMove);
    input.off(Input.EventType.TOUCH_END, this.touchEnd); input.off(Input.EventType.TOUCH_CANCEL, this.touchEnd);
    game.off(Game.EVENT_HIDE, this.hidden);
    for (const m of this.materials.values()) m.destroy();
    for (const m of this.meshes.values()) m.destroy();
  }
}
