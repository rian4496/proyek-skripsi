import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/system-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemLogController::index
 * @see app/Http/Controllers/Admin/SystemLogController.php:19
 * @route '/admin/system-logs'
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
* @see \App\Http\Controllers\Admin\SystemLogController::clear
 * @see app/Http/Controllers/Admin/SystemLogController.php:106
 * @route '/admin/system-logs/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/admin/system-logs/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SystemLogController::clear
 * @see app/Http/Controllers/Admin/SystemLogController.php:106
 * @route '/admin/system-logs/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemLogController::clear
 * @see app/Http/Controllers/Admin/SystemLogController.php:106
 * @route '/admin/system-logs/clear'
 */
clear.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\SystemLogController::clear
 * @see app/Http/Controllers/Admin/SystemLogController.php:106
 * @route '/admin/system-logs/clear'
 */
    const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemLogController::clear
 * @see app/Http/Controllers/Admin/SystemLogController.php:106
 * @route '/admin/system-logs/clear'
 */
        clearForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    clear.form = clearForm
const systemLogs = {
    index: Object.assign(index, index),
clear: Object.assign(clear, clear),
}

export default systemLogs