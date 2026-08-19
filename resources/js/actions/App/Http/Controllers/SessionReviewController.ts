import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SessionReviewController::store
 * @see app/Http/Controllers/SessionReviewController.php:13
 * @route '/session-reviews'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/session-reviews',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SessionReviewController::store
 * @see app/Http/Controllers/SessionReviewController.php:13
 * @route '/session-reviews'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SessionReviewController::store
 * @see app/Http/Controllers/SessionReviewController.php:13
 * @route '/session-reviews'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SessionReviewController::store
 * @see app/Http/Controllers/SessionReviewController.php:13
 * @route '/session-reviews'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SessionReviewController::store
 * @see app/Http/Controllers/SessionReviewController.php:13
 * @route '/session-reviews'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SessionReviewController::destroyAll
 * @see app/Http/Controllers/SessionReviewController.php:41
 * @route '/admin/session-reviews/clear'
 */
export const destroyAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/admin/session-reviews/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SessionReviewController::destroyAll
 * @see app/Http/Controllers/SessionReviewController.php:41
 * @route '/admin/session-reviews/clear'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SessionReviewController::destroyAll
 * @see app/Http/Controllers/SessionReviewController.php:41
 * @route '/admin/session-reviews/clear'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SessionReviewController::destroyAll
 * @see app/Http/Controllers/SessionReviewController.php:41
 * @route '/admin/session-reviews/clear'
 */
    const destroyAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyAll.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SessionReviewController::destroyAll
 * @see app/Http/Controllers/SessionReviewController.php:41
 * @route '/admin/session-reviews/clear'
 */
        destroyAllForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyAll.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyAll.form = destroyAllForm
/**
* @see \App\Http\Controllers\SessionReviewController::destroy
 * @see app/Http/Controllers/SessionReviewController.php:31
 * @route '/admin/session-reviews/{sessionReview}'
 */
export const destroy = (args: { sessionReview: number | { id: number } } | [sessionReview: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/session-reviews/{sessionReview}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SessionReviewController::destroy
 * @see app/Http/Controllers/SessionReviewController.php:31
 * @route '/admin/session-reviews/{sessionReview}'
 */
destroy.url = (args: { sessionReview: number | { id: number } } | [sessionReview: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sessionReview: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sessionReview: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sessionReview: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sessionReview: typeof args.sessionReview === 'object'
                ? args.sessionReview.id
                : args.sessionReview,
                }

    return destroy.definition.url
            .replace('{sessionReview}', parsedArgs.sessionReview.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SessionReviewController::destroy
 * @see app/Http/Controllers/SessionReviewController.php:31
 * @route '/admin/session-reviews/{sessionReview}'
 */
destroy.delete = (args: { sessionReview: number | { id: number } } | [sessionReview: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SessionReviewController::destroy
 * @see app/Http/Controllers/SessionReviewController.php:31
 * @route '/admin/session-reviews/{sessionReview}'
 */
    const destroyForm = (args: { sessionReview: number | { id: number } } | [sessionReview: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SessionReviewController::destroy
 * @see app/Http/Controllers/SessionReviewController.php:31
 * @route '/admin/session-reviews/{sessionReview}'
 */
        destroyForm.delete = (args: { sessionReview: number | { id: number } } | [sessionReview: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SessionReviewController = { store, destroyAll, destroy }

export default SessionReviewController