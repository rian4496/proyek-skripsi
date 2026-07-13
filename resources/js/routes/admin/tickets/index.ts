import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:292
 * @route '/admin/tickets/export-csv'
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
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
 */
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
 */
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
 */
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
 */
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
 */
    const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
 */
        printForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:345
 * @route '/admin/tickets/print'
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
 * @see app/Http/Controllers/Admin/DashboardController.php:857
 * @route '/admin/tickets/clear'
 */
export const destroyAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/admin/tickets/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:857
 * @route '/admin/tickets/clear'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:857
 * @route '/admin/tickets/clear'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroyAll
 * @see app/Http/Controllers/Admin/DashboardController.php:857
 * @route '/admin/tickets/clear'
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
 * @see app/Http/Controllers/Admin/DashboardController.php:857
 * @route '/admin/tickets/clear'
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
 * @see app/Http/Controllers/Admin/DashboardController.php:847
 * @route '/admin/tickets/{feedback}'
 */
export const destroy = (args: { feedback: string | number | { id_feedback: string | number } } | [feedback: string | number | { id_feedback: string | number } ] | string | number | { id_feedback: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/tickets/{feedback}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:847
 * @route '/admin/tickets/{feedback}'
 */
destroy.url = (args: { feedback: string | number | { id_feedback: string | number } } | [feedback: string | number | { id_feedback: string | number } ] | string | number | { id_feedback: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:847
 * @route '/admin/tickets/{feedback}'
 */
destroy.delete = (args: { feedback: string | number | { id_feedback: string | number } } | [feedback: string | number | { id_feedback: string | number } ] | string | number | { id_feedback: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:847
 * @route '/admin/tickets/{feedback}'
 */
    const destroyForm = (args: { feedback: string | number | { id_feedback: string | number } } | [feedback: string | number | { id_feedback: string | number } ] | string | number | { id_feedback: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/DashboardController.php:847
 * @route '/admin/tickets/{feedback}'
 */
        destroyForm.delete = (args: { feedback: string | number | { id_feedback: string | number } } | [feedback: string | number | { id_feedback: string | number } ] | string | number | { id_feedback: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tickets = {
    exportCsv: Object.assign(exportCsv, exportCsv),
print: Object.assign(print, print),
destroyAll: Object.assign(destroyAll, destroyAll),
destroy: Object.assign(destroy, destroy),
}

export default tickets