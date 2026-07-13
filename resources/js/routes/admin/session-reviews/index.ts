import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/session-reviews/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:442
 * @route '/admin/session-reviews/export-csv'
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
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
 */
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/admin/session-reviews/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
 */
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
 */
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
 */
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
 */
    const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
 */
        printForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::print
 * @see app/Http/Controllers/Admin/DashboardController.php:724
 * @route '/admin/session-reviews/print'
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
export const destroy = (args: { sessionReview: string | number | { id: string | number } } | [sessionReview: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { sessionReview: string | number | { id: string | number } } | [sessionReview: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
destroy.delete = (args: { sessionReview: string | number | { id: string | number } } | [sessionReview: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SessionReviewController::destroy
 * @see app/Http/Controllers/SessionReviewController.php:31
 * @route '/admin/session-reviews/{sessionReview}'
 */
    const destroyForm = (args: { sessionReview: string | number | { id: string | number } } | [sessionReview: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
        destroyForm.delete = (args: { sessionReview: string | number | { id: string | number } } | [sessionReview: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const sessionReviews = {
    exportCsv: Object.assign(exportCsv, exportCsv),
print: Object.assign(print, print),
destroyAll: Object.assign(destroyAll, destroyAll),
destroy: Object.assign(destroy, destroy),
}

export default sessionReviews