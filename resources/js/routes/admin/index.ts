import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import broadcast from './broadcast'
import chatLogs from './chat-logs'
import tickets from './tickets'
import sessionReviews from './session-reviews'
import chatRules from './chat-rules'
import uploadDocument from './upload-document'
import systemLogs from './system-logs'
import participants from './participants'
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:48
 * @route '/admin/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:177
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
 * @see app/Http/Controllers/Admin/DashboardController.php:177
 * @route '/admin/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:177
 * @route '/admin/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:177
 * @route '/admin/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:177
 * @route '/admin/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:177
 * @route '/admin/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::exportCsv
 * @see app/Http/Controllers/Admin/DashboardController.php:177
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
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
export const runSeedParticipants = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runSeedParticipants.url(options),
    method: 'get',
})

runSeedParticipants.definition = {
    methods: ["get","head"],
    url: '/admin/run-seed-participants',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
runSeedParticipants.url = (options?: RouteQueryOptions) => {
    return runSeedParticipants.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
runSeedParticipants.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runSeedParticipants.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
runSeedParticipants.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: runSeedParticipants.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
    const runSeedParticipantsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: runSeedParticipants.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
        runSeedParticipantsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runSeedParticipants.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:62
 * @route '/admin/run-seed-participants'
 */
        runSeedParticipantsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runSeedParticipants.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    runSeedParticipants.form = runSeedParticipantsForm
/**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
export const runMigrate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runMigrate.url(options),
    method: 'get',
})

runMigrate.definition = {
    methods: ["get","head"],
    url: '/admin/run-migrate',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
runMigrate.url = (options?: RouteQueryOptions) => {
    return runMigrate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
runMigrate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runMigrate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
runMigrate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: runMigrate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
    const runMigrateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: runMigrate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
        runMigrateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runMigrate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:72
 * @route '/admin/run-migrate'
 */
        runMigrateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runMigrate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    runMigrate.form = runMigrateForm
/**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
export const runGenerateEmails = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runGenerateEmails.url(options),
    method: 'get',
})

runGenerateEmails.definition = {
    methods: ["get","head"],
    url: '/admin/run-generate-emails',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
runGenerateEmails.url = (options?: RouteQueryOptions) => {
    return runGenerateEmails.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
runGenerateEmails.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: runGenerateEmails.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
runGenerateEmails.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: runGenerateEmails.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
    const runGenerateEmailsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: runGenerateEmails.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
        runGenerateEmailsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runGenerateEmails.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:79
 * @route '/admin/run-generate-emails'
 */
        runGenerateEmailsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: runGenerateEmails.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    runGenerateEmails.form = runGenerateEmailsForm
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
broadcast: Object.assign(broadcast, broadcast),
exportCsv: Object.assign(exportCsv, exportCsv),
chatLogs: Object.assign(chatLogs, chatLogs),
tickets: Object.assign(tickets, tickets),
sessionReviews: Object.assign(sessionReviews, sessionReviews),
chatRules: Object.assign(chatRules, chatRules),
uploadDocument: Object.assign(uploadDocument, uploadDocument),
systemLogs: Object.assign(systemLogs, systemLogs),
participants: Object.assign(participants, participants),
runSeedParticipants: Object.assign(runSeedParticipants, runSeedParticipants),
runMigrate: Object.assign(runMigrate, runMigrate),
runGenerateEmails: Object.assign(runGenerateEmails, runGenerateEmails),
}

export default admin