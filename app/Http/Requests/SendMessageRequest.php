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
            'nama_mahasiswa' => [
                'required', 
                'string', 
                'min:3',
                'max:100',
                'regex:/^(?!.*(.)\1{2,}).*$/',
                function ($attribute, $value, $fail) {
                    $lowerName = strtolower($value);
                    $forbidden = ['test', 'tester', 'testing', 'user', 'bot', 'anonim', 'anonymous', 'coba', 'admin', 'dummy', 'hacker'];
                    
                    foreach ($forbidden as $word) {
                        if (str_contains($lowerName, $word)) {
                            $fail('Mohon gunakan nama asli Anda. Nama samaran, "test", atau "user" tidak diperbolehkan.');
                            return;
                        }
                    }
                }
            ],
            'npm' => ['required', 'string', 'regex:/^2[0-9]{9}$/'],
            'fakultas' => ['required', 'string', 'max:100'],
            'prodi' => ['required', 'string', 'max:100'],
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
            'nama_mahasiswa.required' => 'Identitas nama mahasiswa wajib diisi untuk penelitian.',
            'nama_mahasiswa.min' => 'Nama mahasiswa minimal 3 karakter.',
            'nama_mahasiswa.regex' => 'Mohon gunakan nama asli Anda. Huruf yang diulang-ulang (seperti "aaa" atau "bbb") tidak diperbolehkan.',
            'npm.required' => 'Identitas NPM wajib diisi untuk penelitian.',
            'npm.regex' => 'NPM harus berawalan angka "2" dan terdiri dari TEPAT 10 digit (contoh: 2210010497).',
            'fakultas.required' => 'Fakultas wajib dipilih.',
            'prodi.required' => 'Program Studi wajib dipilih.',
        ];
    }
}
