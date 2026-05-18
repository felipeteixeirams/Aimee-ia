import "reflect-metadata";
import { container } from "tsyringe";
import { EmailService } from "../services/EmailService.js";
import { AimeeOrchestrator } from "./llm/AimeeOrchestrator.js";
import {
  chatRepository,
  taskRepository,
  transactionRepository,
  shoppingRepository,
  profileRepository,
  eventRepository,
  configRepository,
  usageRepository
} from "./repositories/index.js";
import { financeSkill } from "../domain/skills/FinanceSkill.js";
import { shoppingSkill } from "../domain/skills/ShoppingSkill.js";
import { routineSkill } from "../domain/skills/RoutineSkill.js";
import { calendarService } from "../services/calendarService.js";

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

// Services
container.registerInstance("CalendarService", calendarService);

export { container };
