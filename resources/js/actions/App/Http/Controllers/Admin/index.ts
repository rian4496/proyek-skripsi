import ParticipantController from './ParticipantController'
import DashboardController from './DashboardController'
import BroadcastController from './BroadcastController'
import ChatRuleController from './ChatRuleController'
import DocumentController from './DocumentController'
import SystemLogController from './SystemLogController'
const Admin = {
    ParticipantController: Object.assign(ParticipantController, ParticipantController),
DashboardController: Object.assign(DashboardController, DashboardController),
BroadcastController: Object.assign(BroadcastController, BroadcastController),
ChatRuleController: Object.assign(ChatRuleController, ChatRuleController),
DocumentController: Object.assign(DocumentController, DocumentController),
SystemLogController: Object.assign(SystemLogController, SystemLogController),
}

export default Admin