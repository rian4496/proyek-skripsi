import DashboardController from './DashboardController'
import ChatRuleController from './ChatRuleController'
import DocumentController from './DocumentController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ChatRuleController: Object.assign(ChatRuleController, ChatRuleController),
DocumentController: Object.assign(DocumentController, DocumentController),
}

export default Admin