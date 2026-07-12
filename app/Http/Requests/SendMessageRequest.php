<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request untuk validasi input pesan chatbot.
 *
 * Sesuai prinsip Clean Architecture pada instructions.md,
 * validasi WAJIB dilakukan di file Request tersendiri, bukan di Controller.
 */
class SendMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Chatbot bersifat publik (tidak perlu autentikasi).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:1000'],
            'nama_mahasiswa' => ['nullable', 'string', 'max:100'],
            'npm' => ['nullable', 'string', 'regex:/^[0-9]{10}$/'],
            'fakultas' => ['nullable', 'string', 'max:100'],
            'prodi' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'message.required' => 'Pesan tidak boleh kosong.',
            'message.max' => 'Pesan terlalu panjang (maksimal 1000 karakter).',
            'npm.regex' => 'Pengisian NPM harus sesuai 10 digit angka (contoh yang benar: 2210010497).',
        ];
    }
}
