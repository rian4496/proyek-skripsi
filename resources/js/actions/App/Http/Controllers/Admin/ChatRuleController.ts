import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/chat-rules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::index
 * @see app/Http/Controllers/Admin/ChatRuleController.php:28
 * @route '/admin/chat-rules'
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
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/chat-rules/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::create
 * @see app/Http/Controllers/Admin/ChatRuleController.php:54
 * @route '/admin/chat-rules/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::store
 * @see app/Http/Controllers/Admin/ChatRuleController.php:72
 * @route '/admin/chat-rules'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/chat-rules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::store
 * @see app/Http/Controllers/Admin/ChatRuleController.php:72
 * @route '/admin/chat-rules'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::store
 * @see app/Http/Controllers/Admin/ChatRuleController.php:72
 * @route '/admin/chat-rules'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ChatRuleController::store
 * @see app/Http/Controllers/Admin/ChatRuleController.php:72
 * @route '/admin/chat-rules'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::store
 * @see app/Http/Controllers/Admin/ChatRuleController.php:72
 * @route '/admin/chat-rules'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
export const edit = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/chat-rules/{chat_rule}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
edit.url = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat_rule: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    chat_rule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chat_rule: args.chat_rule,
                }

    return edit.definition.url
            .replace('{chat_rule}', parsedArgs.chat_rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
edit.get = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
edit.head = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
    const editForm = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
        editForm.get = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::edit
 * @see app/Http/Controllers/Admin/ChatRuleController.php:88
 * @route '/admin/chat-rules/{chat_rule}/edit'
 */
        editForm.head = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
export const update = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/chat-rules/{chat_rule}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
update.url = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat_rule: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    chat_rule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chat_rule: args.chat_rule,
                }

    return update.definition.url
            .replace('{chat_rule}', parsedArgs.chat_rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
update.put = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
update.patch = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
    const updateForm = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
        updateForm.put = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::update
 * @see app/Http/Controllers/Admin/ChatRuleController.php:102
 * @route '/admin/chat-rules/{chat_rule}'
 */
        updateForm.patch = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ChatRuleController::destroy
 * @see app/Http/Controllers/Admin/ChatRuleController.php:118
 * @route '/admin/chat-rules/{chat_rule}'
 */
export const destroy = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/chat-rules/{chat_rule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::destroy
 * @see app/Http/Controllers/Admin/ChatRuleController.php:118
 * @route '/admin/chat-rules/{chat_rule}'
 */
destroy.url = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat_rule: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    chat_rule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chat_rule: args.chat_rule,
                }

    return destroy.definition.url
            .replace('{chat_rule}', parsedArgs.chat_rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatRuleController::destroy
 * @see app/Http/Controllers/Admin/ChatRuleController.php:118
 * @route '/admin/chat-rules/{chat_rule}'
 */
destroy.delete = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ChatRuleController::destroy
 * @see app/Http/Controllers/Admin/ChatRuleController.php:118
 * @route '/admin/chat-rules/{chat_rule}'
 */
    const destroyForm = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ChatRuleController::destroy
 * @see app/Http/Controllers/Admin/ChatRuleController.php:118
 * @route '/admin/chat-rules/{chat_rule}'
 */
        destroyForm.delete = (args: { chat_rule: string | number } | [chat_rule: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ChatRuleController = { index, create, store, edit, update, destroy }

export default ChatRuleController