<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 1. Rute Umum (Sudah ditambahkan ->name('login') agar tidak Error 500 lagi)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// 2. Rute Proteksi User (Sudah diubah dari 'auth:sanctum' menjadi 'auth:api' agar menggunakan JWT)
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
