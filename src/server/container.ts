import "reflect-metadata";
import { container } from "tsyringe";
import { EmailService } from "./services/EmailService.js";
import { AimeeOrchestrator } from "./llm/AimeeOrchestrator.js";

// Registra dependências explicitamente para garantir resolução em ambientes severless
container.registerSingleton(EmailService);
container.registerSingleton(AimeeOrchestrator);

export { container };
