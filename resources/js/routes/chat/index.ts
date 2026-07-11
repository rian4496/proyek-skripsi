import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\ChatController::feedback
 * @see app/Http/Controllers/ChatController.php:52
 * @route '/chat/{chatLog}/feedback'
 */
export const feedback = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: feedback.url(args, options),
    method: 'patch',
})

feedback.definition = {
    methods: ["patch"],
    url: '/chat/{chatLog}/feedback',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ChatController::feedback
 * @see app/Http/Controllers/ChatController.php:52
 * @route '/chat/{chatLog}/feedback'
 */
feedback.url = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return feedback.definition.url
            .replace('{chatLog}', parsedArgs.chatLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::feedback
 * @see app/Http/Controllers/ChatController.php:52
 * @route '/chat/{chatLog}/feedback'
 */
feedback.patch = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: feedback.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ChatController::feedback
 * @see app/Http/Controllers/ChatController.php:52
 * @route '/chat/{chatLog}/feedback'
 */
    const feedbackForm = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: feedback.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::feedback
 * @see app/Http/Controllers/ChatController.php:52
 * @route '/chat/{chatLog}/feedback'
 */
        feedbackForm.patch = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: feedback.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    feedback.form = feedbackForm
const chat = {
    store: Object.assign(store, store),
feedback: Object.assign(feedback, feedback),
}

export default chat