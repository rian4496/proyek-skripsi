import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChatbotController::sendMessage
 * @see app/Http/Controllers/ChatbotController.php:47
 * @route '/api/chatbot/send'
 */
export const sendMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendMessage.url(options),
    method: 'post',
})

sendMessage.definition = {
    methods: ["post"],
    url: '/api/chatbot/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatbotController::sendMessage
 * @see app/Http/Controllers/ChatbotController.php:47
 * @route '/api/chatbot/send'
 */
sendMessage.url = (options?: RouteQueryOptions) => {
    return sendMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatbotController::sendMessage
 * @see app/Http/Controllers/ChatbotController.php:47
 * @route '/api/chatbot/send'
 */
sendMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendMessage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ChatbotController::sendMessage
 * @see app/Http/Controllers/ChatbotController.php:47
 * @route '/api/chatbot/send'
 */
    const sendMessageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendMessage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatbotController::sendMessage
 * @see app/Http/Controllers/ChatbotController.php:47
 * @route '/api/chatbot/send'
 */
        sendMessageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendMessage.url(options),
            method: 'post',
        })
    
    sendMessage.form = sendMessageForm
const ChatbotController = { sendMessage }

export default ChatbotController