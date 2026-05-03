import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';

// --- Home Screen ---
class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Welcome back,", style: GoogleFonts.inter(color: Colors.grey, fontSize: 14)),
                  Text("Ali Store 👋", style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
              const CircleAvatar(backgroundColor: Color(0xFF1F2937), child: Icon(Icons.person_outline)),
            ],
          ),
          const SizedBox(height: 30),
          Text("Today Overview", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
          const SizedBox(height: 15),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 15,
            crossAxisSpacing: 15,
            childAspectRatio: 1.5,
            children: [
              _buildStatCard("Total Orders", "48", Colors.green),
              _buildStatCard("High Risk", "7", Colors.red),
              _buildStatCard("Safe Orders", "41", Colors.green),
              _buildStatCard("Saved (PKR)", "85,000", Colors.green),
            ],
          ),
          const SizedBox(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Recent Alerts", style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
              Text("View All", style: GoogleFonts.inter(color: Colors.green, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 15),
          _buildAlertItem("High Risk Order #ORD-101", "2 min ago", Colors.red),
          _buildAlertItem("Risky Order #ORD-102", "15 min ago", Colors.orange),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: const Color(0xFF121826),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          const Spacer(),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  Widget _buildAlertItem(String title, String time, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: const Color(0xFF121826),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        children: [
          CircleAvatar(radius: 4, backgroundColor: color),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                Text(time, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// --- Quick Scan Screen ---
class QuickScanView extends StatelessWidget {
  const QuickScanView({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const SizedBox(height: 40),
          const Icon(Icons.qr_code_scanner, size: 64, color: Colors.green),
          const SizedBox(height: 20),
          const Text("Quick Scan", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          const Text("Enter customer phone number to check trust score", textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 40),
          TextField(
            decoration: InputDecoration(
              hintText: "0300 1234567",
              prefixIcon: const Icon(Icons.phone_iphone, size: 20),
              suffixIcon: IconButton(onPressed: () {}, icon: const Icon(Icons.qr_code_scanner)),
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {},
              child: const Text("Check Score", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 40),
          const Align(alignment: Alignment.centerLeft, child: Text("Recent Searches", style: TextStyle(fontWeight: FontWeight.w600))),
          const SizedBox(height: 15),
          _buildRecentSearch("0300 1234567", 45, Colors.orange),
          _buildRecentSearch("0345 7654321", 72, Colors.green),
        ],
      ),
    );
  }

  Widget _buildRecentSearch(String phone, int score, Color color) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: const Icon(Icons.history, color: Colors.grey),
      title: Text(phone),
      trailing: Text("$score", style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16)),
    );
  }
}

// --- Analytics Screen ---
class AnalyticsView extends StatelessWidget {
  const AnalyticsView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Analytics", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),
          const Text("Last 7 Days"),
          const SizedBox(height: 15),
          Container(
            height: 250,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF121826), borderRadius: BorderRadius.circular(20)),
            child: Row(
              children: [
                Expanded(
                  child: PieChart(
                    PieChartData(
                      sections: [
                        PieChartSectionData(value: 18, color: Colors.red, radius: 15, showTitle: false),
                        PieChartSectionData(value: 30, color: Colors.orange, radius: 15, showTitle: false),
                        PieChartSectionData(value: 52, color: Colors.green, radius: 15, showTitle: false),
                      ],
                      centerSpaceRadius: 40,
                    ),
                  ),
                ),
                const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _RiskLegendItem("High Risk", "18%", Colors.red),
                    _RiskLegendItem("Risky", "30%", Colors.orange),
                    _RiskLegendItem("Safe", "52%", Colors.green),
                  ],
                )
              ],
            ),
          ),
          const SizedBox(height: 30),
          const Text("Returns vs Deliveries", style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 15),
          Container(
            height: 200,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF121826), borderRadius: BorderRadius.circular(20)),
            child: BarChart(
              BarChartData(
                barGroups: [
                  BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 8, color: Colors.green), BarChartRodData(toY: 2, color: Colors.red)]),
                  BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 10, color: Colors.green), BarChartRodData(toY: 3, color: Colors.red)]),
                  BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 7, color: Colors.green), BarChartRodData(toY: 1, color: Colors.red)]),
                ],
                borderData: FlBorderData(show: false),
                gridData: const FlGridData(show: false),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class _RiskLegendItem extends StatelessWidget {
  final String label, value;
  final Color color;
  const _RiskLegendItem(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          CircleAvatar(radius: 4, backgroundColor: color),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontSize: 12)),
          const SizedBox(width: 5),
          Text(value, style: const TextStyle(fontSize: 10, color: Colors.grey)),
        ],
      ),
    );
  }
}
