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
 * @see app/Http/Controllers/Admin/DashboardController.php:161
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
 * @see app/Http/Controllers/Admin/DashboardController.php:161
 * @route '/admin/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:161
 * @route '/admin/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:161
 * @route '/admin/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:161
 * @route '/admin/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:161
 * @route '/admin/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:161
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
 * @see app/Http/Controllers/Admin/DashboardController.php:540
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
 * @see app/Http/Controllers/Admin/DashboardController.php:540
 * @route '/admin/chat-logs/clear'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:540
 * @route '/admin/chat-logs/clear'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:540
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
 * @see app/Http/Controllers/Admin/DashboardController.php:540
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
 * @see app/Http/Controllers/Admin/DashboardController.php:530
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
 * @see app/Http/Controllers/Admin/DashboardController.php:530
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
 * @see app/Http/Controllers/Admin/DashboardController.php:530
 * @route '/admin/chat-logs/{chatLog}'
 */
destroy.delete = (args: { chatLog: number | { id: number } } | [chatLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:530
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
 * @see app/Http/Controllers/Admin/DashboardController.php:530
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
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
export const exportTicketsCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportTicketsCsv.url(options),
    method: 'get',
})

exportTicketsCsv.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
exportTicketsCsv.url = (options?: RouteQueryOptions) => {
    return exportTicketsCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
exportTicketsCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportTicketsCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
exportTicketsCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportTicketsCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
    const exportTicketsCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportTicketsCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
        exportTicketsCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportTicketsCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportTicketsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:235
 * @route '/admin/tickets/export-csv'
 */
        exportTicketsCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportTicketsCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportTicketsCsv.form = exportTicketsCsvForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
export const printTickets = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printTickets.url(options),
    method: 'get',
})

printTickets.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
printTickets.url = (options?: RouteQueryOptions) => {
    return printTickets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
printTickets.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printTickets.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
printTickets.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: printTickets.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
    const printTicketsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: printTickets.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
        printTicketsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: printTickets.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::printTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:284
 * @route '/admin/tickets/print'
 */
        printTicketsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: printTickets.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    printTickets.form = printTicketsForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:560
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
 * @see app/Http/Controllers/Admin/DashboardController.php:560
 * @route '/admin/tickets/clear'
 */
destroyAllTickets.url = (options?: RouteQueryOptions) => {
    return destroyAllTickets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:560
 * @route '/admin/tickets/clear'
 */
destroyAllTickets.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAllTickets.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAllTickets
 * @see app/Http/Controllers/Admin/DashboardController.php:560
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
 * @see app/Http/Controllers/Admin/DashboardController.php:560
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
 * @see app/Http/Controllers/Admin/DashboardController.php:550
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
 * @see app/Http/Controllers/Admin/DashboardController.php:550
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
 * @see app/Http/Controllers/Admin/DashboardController.php:550
 * @route '/admin/tickets/{feedback}'
 */
destroyTicket.delete = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTicket.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyTicket
 * @see app/Http/Controllers/Admin/DashboardController.php:550
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
 * @see app/Http/Controllers/Admin/DashboardController.php:550
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
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
export const exportSessionReviewsCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportSessionReviewsCsv.url(options),
    method: 'get',
})

exportSessionReviewsCsv.definition = {
    methods: ["get","head"],
    url: '/admin/session-reviews/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
exportSessionReviewsCsv.url = (options?: RouteQueryOptions) => {
    return exportSessionReviewsCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
exportSessionReviewsCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportSessionReviewsCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
exportSessionReviewsCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportSessionReviewsCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
    const exportSessionReviewsCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportSessionReviewsCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
        exportSessionReviewsCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportSessionReviewsCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportSessionReviewsCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:381
 * @route '/admin/session-reviews/export-csv'
 */
        exportSessionReviewsCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportSessionReviewsCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportSessionReviewsCsv.form = exportSessionReviewsCsvForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
export const printSessionReviews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printSessionReviews.url(options),
    method: 'get',
})

printSessionReviews.definition = {
    methods: ["get","head"],
    url: '/admin/session-reviews/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
printSessionReviews.url = (options?: RouteQueryOptions) => {
    return printSessionReviews.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
printSessionReviews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printSessionReviews.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
printSessionReviews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: printSessionReviews.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
    const printSessionReviewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: printSessionReviews.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
        printSessionReviewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: printSessionReviews.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::printSessionReviews
 * @see app/Http/Controllers/Admin/DashboardController.php:427
 * @route '/admin/session-reviews/print'
 */
        printSessionReviewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: printSessionReviews.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    printSessionReviews.form = printSessionReviewsForm
const DashboardController = { index, exportCsv, destroyAll, destroy, exportTicketsCsv, printTickets, destroyAllTickets, destroyTicket, exportSessionReviewsCsv, printSessionReviews }

export default DashboardController