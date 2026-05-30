import { OpenAICompatibleAdapter } from "./OpenAICompatibleAdapter.js";
import { config } from "../../lib/config.js";

export class DeepSeekAdapter extends OpenAICompatibleAdapter {
  constructor() {
    super(
      'deepseek',
      config.deepseekApiKey,
      "https://api.deepseek.com",
      "deepseek-chat"
    );
  }
}
