import {
  Camera, Canvas, Color, DirectionalLight, Graphics, Input, Label, Layers,
  Material, Mesh, MeshRenderer, Node, UITransform, Vec3, Vec4,
  director, game, Game, input, primitives, utils, view, ResolutionPolicy, sys,
  type EventKeyboard, type EventTouch,
} from 'cc';
import { createCocosPlatform } from 'db://assets/collection/platform/cocos-host';

export const color = (hex: string) => new Color().fromHEX(hex);

/** Reusable Creator services. Game state remains in each game's pure core. */
export class GameView {
  readonly scene = director.getScene()!;
  readonly world = new Node('World');
  readonly camera: Camera;
  readonly canvas = new Node('HUD');
  readonly platform;
  readonly materials = new Map<string, Material>();
  readonly meshes = new Map<string, Mesh>();
  readonly objects = new Map<string, Node>();
  readonly texts = new Map<string, Label>();
  readonly buttons = new Map<string, { node: Node; label: Label; action: () => void }>();
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

  constructor(key: string, background = '#233c59') {
    view.setDesignResolutionSize(390, 844, ResolutionPolicy.FIXED_HEIGHT);
    view.resizeWithBrowserSize(true);
    this.world.parent = this.scene;
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
    this.platform = createCocosPlatform({ storage: sys.localStorage, onHide: callback => {
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
    const size = view.getVisibleSize();
    this.width = size.width; this.height = size.height;
    this.canvas.getComponent(UITransform)!.setContentSize(this.width, this.height);
    // World and UI cameras have separate layers; the visible height stays 844.
    this.canvas.setPosition(this.width / 2, this.height / 2, 0);
    this.canvas.getComponent(Canvas)!.cameraComponent!.node.setPosition(this.width / 2, this.height / 2, 1000);
  }

  material(hex: string) {
    if (!this.materials.has(hex)) {
      const material = new Material();
      material.initialize({ effectName: 'builtin-unlit' });
      material.setProperty('mainColor', color(hex));
      this.materials.set(hex, material);
    }
    return this.materials.get(hex)!;
  }

  shape(id: string, shape: 'box' | 'sphere' | 'cylinder' | 'cone', hex: string, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
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
    node.getComponent(MeshRenderer)!.setSharedMaterial(this.material(hex), 0);
    node.setPosition(x, y, z); node.setScale(sx, sy, sz);
    return node;
  }

  begin() {
    this.resize();
    for (const node of this.objects.values()) node.active = false;
    for (const label of this.texts.values()) label.node.active = false;
    for (const button of this.buttons.values()) button.node.active = false;
  }

  text(id: string, value: string, x: number, y: number, size = 18, hex = '#ffffff', width = 360) {
    let label = this.texts.get(id);
    if (!label) {
      const node = new Node(id); node.parent = this.canvas; node.layer = Layers.Enum.UI_2D;
      node.addComponent(UITransform);
      label = node.addComponent(Label); label.fontFamily = 'sans-serif';
      label.overflow = Label.Overflow.SHRINK; label.horizontalAlign = Label.HorizontalAlign.CENTER;
      label.verticalAlign = Label.VerticalAlign.CENTER; label.enableWrapText = true;
      this.texts.set(id, label);
    }
    label.node.active = true; label.node.setPosition(x, y, 0);
    label.node.getComponent(UITransform)!.setContentSize(width, size * 2.6);
    label.fontSize = size; label.lineHeight = size * 1.4;
    label.color = color(hex); if (label.string !== value) label.string = value;
    return label;
  }

  button(id: string, value: string, x: number, y: number, width: number, action: () => void, accent = false) {
    let button = this.buttons.get(id);
    if (!button) {
      const node = new Node(id); node.parent = this.canvas; node.layer = Layers.Enum.UI_2D;
      node.addComponent(UITransform);
      const g = node.addComponent(Graphics); g.fillColor = color(accent ? '#159cfa' : '#203e5c');
      g.strokeColor = color(accent ? '#67d9ff' : '#49667f'); g.lineWidth = 1;
      g.roundRect(-width / 2, -23, width, 46, 10); g.fill(); g.stroke();
      const textNode = new Node('Label'); textNode.parent = node; textNode.layer = Layers.Enum.UI_2D;
      textNode.addComponent(UITransform).setContentSize(width - 12, 44);
      const label = textNode.addComponent(Label); label.fontSize = 14; label.lineHeight = 20;
      label.horizontalAlign = Label.HorizontalAlign.CENTER; label.verticalAlign = Label.VerticalAlign.CENTER;
      button = { node, label, action }; this.buttons.set(id, button);
      node.on(Node.EventType.TOUCH_END, () => this.buttons.get(id)!.action());
    }
    button.node.getComponent(UITransform)!.setContentSize(width, 46);
    button.node.active = true; button.node.setPosition(x, y, 0);
    button.label.string = value; button.action = action;
    return button.node;
  }

  worldText(id: string, value: string, point: Vec3, size = 18) {
    const projected = this.camera.convertToUINode(point, this.canvas);
    this.text(id, value, projected.x, projected.y, size);
  }

  destroy() {
    input.off(Input.EventType.KEY_DOWN, this.keyDown); input.off(Input.EventType.KEY_UP, this.keyUp);
    input.off(Input.EventType.TOUCH_START, this.touchStart); input.off(Input.EventType.TOUCH_MOVE, this.touchMove);
    input.off(Input.EventType.TOUCH_END, this.touchEnd); input.off(Input.EventType.TOUCH_CANCEL, this.touchEnd);
    game.off(Game.EVENT_HIDE, this.hidden);
    for (const m of this.materials.values()) m.destroy();
    for (const m of this.meshes.values()) m.destroy();
  }
}
