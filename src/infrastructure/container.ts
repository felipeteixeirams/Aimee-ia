import "reflect-metadata";
import { container } from "tsyringe";
import { EmailService } from "../services/EmailService.js";
import { AimeeOrchestrator } from "./llm/AimeeOrchestrator.js";

// Registra dependências se necessário (tsyringe resolve Singletons automaticamente se anotados)
// Mas podemos registrar manualmente se quisermos controle total
// container.registerSingleton(EmailService);
// container.registerSingleton(AimeeOrchestrator);

export { container };
