import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import 'order_tracking_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final response = await http.post(
        Uri.parse(
            'http://192.168.100.48:3000/conductores/login'), // Cambia esto a tu URL de API
        body: jsonEncode({
          'email': _emailController.text,
          'password': _passwordController.text,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      setState(() {
        _isLoading = false;
      });

      print(response.body);

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print(data);
        if (data['data'] != null) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const OrderTrackingPage()),
          );
        } else {
          setState(() {
            _errorMessage = 'Credenciales incorrectas';
          });
        }
      } else {
        setState(() {
          _errorMessage = 'A ocurrido un error intente de nuevo';
        });
      }
    }
  }

  void saveLoginData(String token) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/logo-salvietti.jpg',
                width: 200,
                height: 200,
              ),
              const SizedBox(height: 40),
              Padding(
                  padding: const EdgeInsets.only(left: 40, right: 40),
                  child: TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Porfavor ingresa tu email';
                      }
                      return null;
                    },
                  )),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.only(left: 40, right: 40),
                child: TextFormField(
                  controller: _passwordController,
                  decoration: const InputDecoration(labelText: 'Contraseña'),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Porfavor ingresa tu password';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(height: 20),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _login,
                      child: const Text('Login'),
                    ),
              if (_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
