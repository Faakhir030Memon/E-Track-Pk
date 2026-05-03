import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HighRiskAlertScreen extends StatelessWidget {
  final int score;
  final String hashedId;
  final List<String> reasons;

  const HighRiskAlertScreen({
    super.key, 
    required this.score, 
    required this.hashedId, 
    required this.reasons
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEF4444),
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.topLeft,
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Icon(Icons.warning_rounded, size: 80, color: Colors.white),
                  const SizedBox(height: 10),
                  Text(
                    "High Risk Alert",
                    style: GoogleFonts.inter(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const Text(
                    "This customer is High Risk",
                    style: TextStyle(color: Colors.white70),
                  ),
                  const SizedBox(height: 30),
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white30, width: 2),
                    ),
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text("$score", style: const TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.bold)),
                        const Text("/100", style: TextStyle(color: Colors.white70, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(30),
              decoration: const BoxDecoration(
                color: Color(0xFF080B12),
                borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Risk Reasons", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 15),
                  ...reasons.map((r) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      children: [
                        const Icon(Icons.circle, size: 6, color: Colors.red),
                        const SizedBox(width: 10),
                        Text(r, style: const TextStyle(color: Colors.white70)),
                      ],
                    ),
                  )),
                  const SizedBox(height: 30),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(vertical: 15),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {},
                          child: const Text("Call Customer", style: TextStyle(color: Colors.white)),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.white24),
                            padding: const EdgeInsets.symmetric(vertical: 15),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {},
                          child: const Text("Send OTP", style: TextStyle(color: Colors.white)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
