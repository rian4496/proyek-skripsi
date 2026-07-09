import ChatController from './ChatController'
import FeedbackController from './FeedbackController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    ChatController: Object.assign(ChatController, ChatController),
FeedbackController: Object.assign(FeedbackController, FeedbackController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers