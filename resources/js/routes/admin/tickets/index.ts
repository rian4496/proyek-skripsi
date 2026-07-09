import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
export const destroy = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/tickets/{feedback}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
destroy.url = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
destroy.delete = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::destroy
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
    const destroyForm = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/DashboardController.php:238
 * @route '/admin/tickets/{feedback}'
 */
        destroyForm.delete = (args: { feedback: number | { id_feedback: number } } | [feedback: number | { id_feedback: number } ] | number | { id_feedback: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
    destroy: Object.assign(destroy, destroy),
}

export default tickets