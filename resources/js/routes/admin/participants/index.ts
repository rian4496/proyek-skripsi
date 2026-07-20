import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/participants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ParticipantController::index
 * @see app/Http/Controllers/Admin/ParticipantController.php:52
 * @route '/admin/participants'
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
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/participants/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ParticipantController::exportCsv
 * @see app/Http/Controllers/Admin/ParticipantController.php:137
 * @route '/admin/participants/export-csv'
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
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
 */
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/admin/participants/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
 */
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
 */
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
 */
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
 */
    const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
 */
        printForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ParticipantController::print
 * @see app/Http/Controllers/Admin/ParticipantController.php:202
 * @route '/admin/participants/print'
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
* @see \App\Http\Controllers\Admin\ParticipantController::destroy
 * @see app/Http/Controllers/Admin/ParticipantController.php:127
 * @route '/admin/participants/{participant}'
 */
export const destroy = (args: { participant: number | { id: number } } | [participant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/participants/{participant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ParticipantController::destroy
 * @see app/Http/Controllers/Admin/ParticipantController.php:127
 * @route '/admin/participants/{participant}'
 */
destroy.url = (args: { participant: number | { id: number } } | [participant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { participant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { participant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    participant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        participant: typeof args.participant === 'object'
                ? args.participant.id
                : args.participant,
                }

    return destroy.definition.url
            .replace('{participant}', parsedArgs.participant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ParticipantController::destroy
 * @see app/Http/Controllers/Admin/ParticipantController.php:127
 * @route '/admin/participants/{participant}'
 */
destroy.delete = (args: { participant: number | { id: number } } | [participant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ParticipantController::destroy
 * @see app/Http/Controllers/Admin/ParticipantController.php:127
 * @route '/admin/participants/{participant}'
 */
    const destroyForm = (args: { participant: number | { id: number } } | [participant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ParticipantController::destroy
 * @see app/Http/Controllers/Admin/ParticipantController.php:127
 * @route '/admin/participants/{participant}'
 */
        destroyForm.delete = (args: { participant: number | { id: number } } | [participant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const participants = {
    index: Object.assign(index, index),
exportCsv: Object.assign(exportCsv, exportCsv),
print: Object.assign(print, print),
destroy: Object.assign(destroy, destroy),
}

export default participants