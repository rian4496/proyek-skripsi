import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:25
 * @route '/admin/dashboard'
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
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:144
 * @route '/admin/export-csv'
 */
        exportCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportCsv.form = exportCsvForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:228
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
 * @see app/Http/Controllers/Admin/DashboardController.php:228
 * @route '/admin/chat-logs/clear'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:228
 * @route '/admin/chat-logs/clear'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:228
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
 * @see app/Http/Controllers/Admin/DashboardController.php:228
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
 * @see app/Http/Controllers/Admin/DashboardController.php:218
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
 * @see app/Http/Controllers/Admin/DashboardController.php:218
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
 * @see app/Http/Controllers/Admin/DashboardController.php:218
 * @route '/admin/chat-logs/{chatLog}'
 */
destroy.delete = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:218
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
 * @see app/Http/Controllers/Admin/DashboardController.php:218
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
/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:248
 * @route '/admin/tickets/clear'
 */
export const destroyAllTickets = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAllTickets.url(options),
    method: 'delete',
})

destroyAllTickets.definition = {
    methods: ["delete"],
    url: '/admin/tickets/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:248
 * @route '/admin/tickets/clear'
 */
destroyAllTickets.url = (options?: RouteQueryOptions) => {
    return destroyAllTickets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:248
 * @route '/admin/tickets/clear'
 */
destroyAllTickets.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAllTickets.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:248
 * @route '/admin/tickets/clear'
 */
    const destroyAllTicketsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyAllTickets.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:248
 * @route '/admin/tickets/clear'
 */
        destroyAllTicketsForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyAllTickets.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyAllTickets.form = destroyAllTicketsForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyTicket
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
export const destroyTicket = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTicket.url(args, options),
    method: 'delete',
})

destroyTicket.definition = {
    methods: ["delete"],
    url: '/admin/tickets/{feedback}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyTicket
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
destroyTicket.url = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_feedback' in args) {
            args = { feedback: args.id_feedback }
        }
    
    if (Array.isArray(args)) {
        args = {
                    feedback: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        feedback: typeof args.feedback === 'object'
                ? args.feedback.id_feedback
                : args.feedback,
                }

    return destroyTicket.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyTicket
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
destroyTicket.delete = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTicket.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyTicket
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
    const destroyTicketForm = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyTicket.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyTicket
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
        destroyTicketForm.delete = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyTicket.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyTicket.form = destroyTicketForm
const DashboardController = { index, exportCsv, destroyAll, destroy, destroyAllTickets, destroyTicket }

export default DashboardController