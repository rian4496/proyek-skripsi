import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/broadcast',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BroadcastController::index
 * @see app/Http/Controllers/Admin/BroadcastController.php:17
 * @route '/admin/broadcast'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\BroadcastController::store
 * @see app/Http/Controllers/Admin/BroadcastController.php:31
 * @route '/admin/broadcast'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/broadcast',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BroadcastController::store
 * @see app/Http/Controllers/Admin/BroadcastController.php:31
 * @route '/admin/broadcast'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BroadcastController::store
 * @see app/Http/Controllers/Admin/BroadcastController.php:31
 * @route '/admin/broadcast'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\BroadcastController::store
 * @see app/Http/Controllers/Admin/BroadcastController.php:31
 * @route '/admin/broadcast'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BroadcastController::store
 * @see app/Http/Controllers/Admin/BroadcastController.php:31
 * @route '/admin/broadcast'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const BroadcastController = { index, store }

export default BroadcastController