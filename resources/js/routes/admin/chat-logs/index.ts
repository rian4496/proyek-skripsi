import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/admin/chat-logs/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
    const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
        printForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:481
 * @route '/admin/chat-logs/print'
 */
        printForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    print.form = printForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:817
 * @route '/admin/chat-logs/clear'
 */
export const destroyAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/admin/chat-logs/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:817
 * @route '/admin/chat-logs/clear'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:817
 * @route '/admin/chat-logs/clear'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:817
 * @route '/admin/chat-logs/clear'
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
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:817
 * @route '/admin/chat-logs/clear'
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
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:807
 * @route '/admin/chat-logs/{chatLog}'
 */
export const destroy = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/chat-logs/{chatLog}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:807
 * @route '/admin/chat-logs/{chatLog}'
 */
destroy.url = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{chatLog}', parsedArgs.chatLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:807
 * @route '/admin/chat-logs/{chatLog}'
 */
destroy.delete = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:807
 * @route '/admin/chat-logs/{chatLog}'
 */
    const destroyForm = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:807
 * @route '/admin/chat-logs/{chatLog}'
 */
        destroyForm.delete = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const chatLogs = {
    print: Object.assign(print, print),
destroyAll: Object.assign(destroyAll, destroyAll),
destroy: Object.assign(destroy, destroy),
}

export default chatLogs