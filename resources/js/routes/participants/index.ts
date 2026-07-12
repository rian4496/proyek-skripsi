import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ParticipantController::store
 * @see app/Http/Controllers/Admin/ParticipantController.php:21
 * @route '/participants'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/participants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ParticipantController::store
 * @see app/Http/Controllers/Admin/ParticipantController.php:21
 * @route '/participants'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ParticipantController::store
 * @see app/Http/Controllers/Admin/ParticipantController.php:21
 * @route '/participants'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ParticipantController::store
 * @see app/Http/Controllers/Admin/ParticipantController.php:21
 * @route '/participants'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ParticipantController::store
 * @see app/Http/Controllers/Admin/ParticipantController.php:21
 * @route '/participants'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const participants = {
    store: Object.assign(store, store),
}

export default participants