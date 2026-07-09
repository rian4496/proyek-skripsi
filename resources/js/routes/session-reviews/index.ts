import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
const sessionReviews = {
    store: Object.assign(store, store),
}

export default sessionReviews