import "reflect-metadata";
import { container } from "tsyringe";
import { EmailService } from "./services/EmailService.js";
import { AimeeOrchestrator } from "./llm/AimeeOrchestrator.js";

// Repositories
import { chatRepository } from "../infrastructure/repositories/ChatRepository.js";
import { taskRepository } from "../infrastructure/repositories/TaskRepository.js";
import { transactionRepository } from "../infrastructure/repositories/TransactionRepository.js";
import { shoppingRepository } from "../infrastructure/repositories/ShoppingRepository.js";
import { profileRepository } from "../infrastructure/repositories/ProfileRepository.js";
import { eventRepository } from "../infrastructure/repositories/EventRepository.js";
import { configRepository } from "../infrastructure/repositories/ConfigRepository.js";
import { usageRepository } from "../infrastructure/repositories/UsageRepository.js";

// Skills
import { financeSkill } from "../domain/skills/FinanceSkill.js";
import { shoppingSkill } from "../domain/skills/ShoppingSkill.js";
import { routineSkill } from "../domain/skills/RoutineSkill.js";

// Registra dependências explicitamente para garantir resolução em ambientes severless
container.registerSingleton(EmailService);
container.registerSingleton(AimeeOrchestrator);

// Repositories
container.registerInstance("ChatRepository", chatRepository);
container.registerInstance("TaskRepository", taskRepository);
container.registerInstance("TransactionRepository", transactionRepository);
container.registerInstance("ShoppingRepository", shoppingRepository);
container.registerInstance("ProfileRepository", profileRepository);
container.registerInstance("EventRepository", eventRepository);
container.registerInstance("ConfigRepository", configRepository);
container.registerInstance("UsageRepository", usageRepository);

// Skills
container.registerInstance("FinanceSkill", financeSkill);
container.registerInstance("ShoppingSkill", shoppingSkill);
container.registerInstance("RoutineSkill", routineSkill);

export { container };
