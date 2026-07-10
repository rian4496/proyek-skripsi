<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Admin::updateOrCreate(
            ['email' => 'admin@uniska-bjm.ac.id'],
            [
                'name' => 'Admin UNISKA',
                'password' => bcrypt('uniska2026'), // Ganti sesuai keinginan
            ]
        );
    }
}
