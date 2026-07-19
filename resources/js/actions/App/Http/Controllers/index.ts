import ChatController from './ChatController'
import FeedbackController from './FeedbackController'
import SessionReviewController from './SessionReviewController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    ChatController: Object.assign(ChatController, ChatController),
FeedbackController: Object.assign(FeedbackController, FeedbackController),
SessionReviewController: Object.assign(SessionReviewController, SessionReviewController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers