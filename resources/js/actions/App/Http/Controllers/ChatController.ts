import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:25
 * @route '/chat'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:25
 * @route '/chat'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:25
 * @route '/chat'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:25
 * @route '/chat'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:25
 * @route '/chat'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ChatController::storeFeedback
 * @see app/Http/Controllers/ChatController.php:49
 * @route '/chat/{chatLog}/feedback'
 */
export const storeFeedback = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: storeFeedback.url(args, options),
    method: 'patch',
})

storeFeedback.definition = {
    methods: ["patch"],
    url: '/chat/{chatLog}/feedback',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ChatController::storeFeedback
 * @see app/Http/Controllers/ChatController.php:49
 * @route '/chat/{chatLog}/feedback'
 */
storeFeedback.url = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chatLog: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { chatLog: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    chatLog: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chatLog: typeof args.chatLog === 'object'
                ? args.chatLog.id
                : args.chatLog,
                }

    return storeFeedback.definition.url
            .replace('{chatLog}', parsedArgs.chatLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::storeFeedback
 * @see app/Http/Controllers/ChatController.php:49
 * @route '/chat/{chatLog}/feedback'
 */
storeFeedback.patch = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: storeFeedback.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ChatController::storeFeedback
 * @see app/Http/Controllers/ChatController.php:49
 * @route '/chat/{chatLog}/feedback'
 */
    const storeFeedbackForm = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeFeedback.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::storeFeedback
 * @see app/Http/Controllers/ChatController.php:49
 * @route '/chat/{chatLog}/feedback'
 */
        storeFeedbackForm.patch = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeFeedback.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    storeFeedback.form = storeFeedbackForm
const ChatController = { store, storeFeedback }

export default ChatController