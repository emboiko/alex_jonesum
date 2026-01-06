#include <node_api.h>
#include "jonesum.h"
#include <cstring>
#include <cstdlib>

struct JonesumContext {
    jonesum_context_t* ctx;
    napi_env env;
    napi_ref wrapper;
};

static void FinalizeJonesumContext(napi_env env, void* finalize_data, void* finalize_hint) {
    JonesumContext* context = (JonesumContext*)finalize_data;
    if (context != NULL && context->ctx != NULL) {
        jonesum_free(context->ctx);
        context->ctx = NULL;
    }
    if (context != NULL) {
        delete context;
    }
}

static napi_value JonesumInit(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_value this_arg;
    napi_get_cb_info(env, info, &argc, args, &this_arg, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Expected array of vocabulary as argument");
        return NULL;
    }

    napi_value vocabulary_array = args[0];
    bool is_array = false;
    napi_is_array(env, vocabulary_array, &is_array);
    if (!is_array) {
        napi_throw_type_error(env, NULL, "Expected array of strings");
        return NULL;
    }

    uint32_t array_length = 0;
    napi_get_array_length(env, vocabulary_array, &array_length);
    if (array_length == 0) {
        napi_throw_error(env, NULL, "Vocabulary array cannot be empty");
        return NULL;
    }

    const char** vocabulary = new const char*[array_length];
    char** vocabulary_storage = new char*[array_length];

    for (uint32_t i = 0; i < array_length; i++) {
        napi_value element;
        napi_get_element(env, vocabulary_array, i, &element);

        napi_valuetype element_type;
        napi_typeof(env, element, &element_type);
        if (element_type != napi_string) {
            for (uint32_t j = 0; j < i; j++) {
                delete[] vocabulary_storage[j];
            }
            delete[] vocabulary_storage;
            delete[] vocabulary;
            napi_throw_type_error(env, NULL, "All vocabulary items must be strings");
            return NULL;
        }

        size_t str_length = 0;
        napi_get_value_string_utf8(env, element, NULL, 0, &str_length);
        char* str = new char[str_length + 1];
        napi_get_value_string_utf8(env, element, str, str_length + 1, &str_length);
        vocabulary_storage[i] = str;
        vocabulary[i] = str;
    }

    jonesum_context_t* ctx = jonesum_init(vocabulary, (size_t)array_length);

    for (uint32_t i = 0; i < array_length; i++) {
        delete[] vocabulary_storage[i];
    }
    delete[] vocabulary_storage;
    delete[] vocabulary;

    if (ctx == NULL) {
        napi_throw_error(env, NULL, "Failed to initialize jonesum context");
        return NULL;
    }

    JonesumContext* context = new JonesumContext();
    context->ctx = ctx;
    context->env = env;
    context->wrapper = NULL;

    napi_wrap(env, this_arg, context, FinalizeJonesumContext, NULL, &context->wrapper);

    return NULL;
}

static napi_value JonesumRant(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_value this_arg;
    napi_get_cb_info(env, info, &argc, args, &this_arg, NULL);

    JonesumContext* context = NULL;
    napi_unwrap(env, this_arg, (void**)&context);

    if (context == NULL || context->ctx == NULL) {
        napi_throw_error(env, NULL, "Context not initialized");
        return NULL;
    }

    int count = 0;
    if (argc >= 1) {
        napi_get_value_int32(env, args[0], &count);
    }

    char* result = jonesum_rant(context->ctx, count);

    if (result == NULL) {
        napi_throw_error(env, NULL, "Failed to generate rant");
        return NULL;
    }

    napi_value napi_result;
    napi_create_string_utf8(env, result, NAPI_AUTO_LENGTH, &napi_result);
    free(result);

    return napi_result;
}

static napi_value Init(napi_env env, napi_value exports) {
    napi_value jonesum_class;
    napi_property_descriptor properties[] = {
        {"rant", NULL, JonesumRant, NULL, NULL, NULL, napi_default, NULL},
    };

    napi_define_class(env, "Jonesum", NAPI_AUTO_LENGTH, JonesumInit, NULL,
                      sizeof(properties) / sizeof(properties[0]), properties, &jonesum_class);

    napi_set_named_property(env, exports, "Jonesum", jonesum_class);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
