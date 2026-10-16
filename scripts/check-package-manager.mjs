const agent = process.env.npm_config_user_agent ?? "";
if (!agent.startsWith("pnpm/")) {
  console.error(
    "本仓库统一使用 pnpm。请执行 corepack enable，然后在仓库根目录执行 pnpm install。",
  );
  process.exit(1);
}
