import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";

// Dynamically load jsPDF from CDN for in-browser PDF generation
function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) return resolve(window.jspdf.jsPDF);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(script);
  });
}

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/reports");
      setReport(data.report || data || null);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── PDF Download ──────────────────────────────────────────────────────────
  const downloadPDF = async () => {
    if (!report) return;
    setPdfLoading(true);
    try {
      const JsPDF = await loadJsPDF();
      const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      let y = margin;

      const checkPage = (needed = 10) => {
        if (y + needed > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const drawHRule = (color = [220, 220, 220]) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      };

      // ── Header band ──
      doc.setFillColor(74, 124, 59);
      doc.rect(0, 0, pageW, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("KrishiBazaar – Platform Report", margin, 17);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, 17, { align: "right" });
      y = 36;

      // ── KPI Summary ──
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", margin, y);
      y += 6;
      drawHRule([74, 124, 59]);

      const kpis = [
        ["Total Users",    report.totalUsers    ?? "—"],
        ["Total Farmers",  report.totalFarmers  ?? "—"],
        ["Total Buyers",   report.totalBuyers   ?? "—"],
        ["Total Orders",   report.totalOrders   ?? "—"],
        ["Pending Orders", report.pendingOrders ?? "—"],
        ["Total Revenue",  `Rs. ${(report.totalRevenue ?? 0).toLocaleString()}`],
        ["Active Crops",   report.activeCrops   ?? "—"],
        ["Total Listings", report.totalCrops    ?? "—"],
      ];

      const colW = (pageW - margin * 2) / 2;
      kpis.forEach(([label, value], i) => {
        checkPage(12);
        const col = i % 2;
        const x = margin + col * colW;

        if (Math.floor(i / 2) % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          if (col === 0) doc.rect(margin, y - 4, pageW - margin * 2, 10, "F");
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(label, x + 3, y + 1);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text(String(value), x + 3, y + 7);

        if (col === 1) y += 13;
      });
      if (kpis.length % 2 !== 0) y += 13;
      y += 6;

      // ── Orders by Status ──
      const salesByStatus = report.salesByStatus || {};
      const statusEntries = Object.entries(salesByStatus);
      if (statusEntries.length > 0) {
        checkPage(16);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text("Orders by Status", margin, y);
        y += 6;
        drawHRule([74, 124, 59]);

        const maxVal = Math.max(...statusEntries.map(([, v]) => v), 1);
        const barAreaW = pageW - margin * 2 - 40;
        const barColorMap = {
          PENDING:   [245, 158, 11],
          CONFIRMED: [59, 130, 246],
          DELIVERED: [74, 124, 59],
          PAID:      [16, 185, 129],
          CANCELLED: [239, 68, 68],
        };

        statusEntries.forEach(([status, count]) => {
          checkPage(12);
          const pct = count / maxVal;
          const barW = Math.max(barAreaW * pct, 1);
          const [r, g, b] = barColorMap[status] || [74, 124, 59];

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(status, margin, y + 4);

          doc.setFillColor(240, 240, 240);
          doc.roundedRect(margin + 30, y, barAreaW, 6, 1, 1, "F");

          doc.setFillColor(r, g, b);
          doc.roundedRect(margin + 30, y, barW, 6, 1, 1, "F");

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 30, 30);
          doc.text(String(count), pageW - margin, y + 4.5, { align: "right" });

          y += 11;
        });
        y += 4;
      }

      // ── Recent Activity ──
      const recentActivity = report.recentActivity || [];
      if (recentActivity.length > 0) {
        checkPage(16);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text("Recent Activity", margin, y);
        y += 6;
        drawHRule([74, 124, 59]);

        recentActivity.forEach((item, idx) => {
          checkPage(14);
          const bg = idx % 2 === 0 ? [245, 247, 250] : [255, 255, 255];
          doc.setFillColor(...bg);
          doc.rect(margin, y - 3, pageW - margin * 2, 11, "F");

          const typeTag = item.type === "ORDER" ? "[ORDER]" : item.type === "USER" ? "[USER]" : "[CROP]";
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(74, 124, 59);
          doc.text(typeTag, margin + 2, y + 4);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 30, 30);
          doc.text(item.message || item.description || "—", margin + 18, y + 4, { maxWidth: pageW - margin * 2 - 40 });

          if (item.createdAt) {
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(7);
            doc.text(new Date(item.createdAt).toLocaleString(), pageW - margin, y + 4, { align: "right" });
          }
          y += 12;
        });
      }

      // ── Footer on every page ──
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(74, 124, 59);
        doc.rect(0, pageH - 10, pageW, 10, "F");
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");
        doc.text("KrishiBazaar Admin Report — Confidential", margin, pageH - 4);
        doc.text(`Page ${i} of ${totalPages}`, pageW - margin, pageH - 4, { align: "right" });
      }

      doc.save(`krishibazaar-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      alert("PDF generation failed: " + e.message);
    } finally {
      setPdfLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const salesByStatus  = report?.salesByStatus || {};
  const statusEntries  = Object.entries(salesByStatus);
  const maxStatusVal   = Math.max(...statusEntries.map(([, v]) => v), 1);
  const recentActivity = report?.recentActivity || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "24px" }}>
      <style>{`
        @media (max-width: 968px) {
          .report-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .report-grid { grid-template-columns: 1fr !important; }
          .report-header-row { flex-direction: column !important; align-items: flex-start !important; }
          .report-header-btns { width: 100% !important; }
          .report-header-btns button { width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <div className="report-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a", margin: 0, marginBottom: "8px" }}>
              Platform Reports
            </h1>
            <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
              Overview of platform performance, user activity, and sales volume
            </p>
          </div>

          <div className="report-header-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={load}
              style={{ padding: "10px 20px", background: "white", color: "#4a7c3b", border: "1px solid #4a7c3b", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >
              🔄 Refresh
            </button>
            <button
              onClick={downloadPDF}
              disabled={!report || pdfLoading}
              style={{
                padding: "10px 20px",
                background: report && !pdfLoading ? "#4a7c3b" : "#a5c49a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: report && !pdfLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s"
              }}
            >
              {pdfLoading ? "⏳ Generating..." : "📄 Download PDF"}
            </button>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div style={{ padding: "14px 16px", background: "#ffebee", border: "1px solid #ffcdd2", borderRadius: "8px", color: "#c62828", fontSize: "14px", marginBottom: "24px" }}>
            ⚠️ {err}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "80px", textAlign: "center", color: "#999", fontSize: "15px", background: "white", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
            Loading report data...
          </div>
        ) : report ? (
          <>
            {/* KPI Cards */}
            <div className="report-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
              {[
                { label: "Total Users",   value: report.totalUsers   ?? "—", sub: `${report.totalFarmers ?? 0} farmers · ${report.totalBuyers ?? 0} buyers`, color: "#1a1a1a" },
                { label: "Total Orders",  value: report.totalOrders  ?? "—", sub: `${report.pendingOrders ?? 0} pending`, color: "#1a1a1a" },
                { label: "Total Revenue", value: `रु ${(report.totalRevenue ?? 0).toLocaleString()}`, sub: "All completed sales", color: "#4a7c3b" },
                { label: "Active Crops",  value: report.activeCrops  ?? "—", sub: `${report.totalCrops ?? 0} total listings`, color: "#1e40af" },
              ].map(s => (
                <div key={s.label} style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0" }}>
                  <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>{s.label}</div>
                  <div style={{ fontSize: s.label === "Total Revenue" ? "22px" : "32px", fontWeight: "700", color: s.color, marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "13px", color: "#888" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Orders by Status — full width */}
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0, marginBottom: "24px" }}>
                Orders by Status
              </h2>
              {statusEntries.length === 0 ? (
                <div style={{ color: "#999", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No data available</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {statusEntries.map(([status, count]) => {
                    const barColors = { PENDING: "#f59e0b", CONFIRMED: "#3b82f6", DELIVERED: "#4a7c3b", PAID: "#10b981", CANCELLED: "#ef4444" };
                    const pct = Math.round((count / maxStatusVal) * 100);
                    return (
                      <div key={status}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{status}</span>
                          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a1a" }}>{count}</span>
                        </div>
                        <div style={{ height: "10px", background: "#f0f0f0", borderRadius: "6px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: barColors[status] || "#4a7c3b", borderRadius: "6px", transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0, marginBottom: "20px" }}>
                Recent Activity
              </h2>
              {recentActivity.length === 0 ? (
                <div style={{ color: "#999", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
                  No recent activity data available
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recentActivity.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f0f0f0" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                        background: item.type === "ORDER" ? "#dbeafe" : item.type === "USER" ? "#e8f5e9" : "#fef3c7",
                        color:      item.type === "ORDER" ? "#1e40af" : item.type === "USER" ? "#2e7d32" : "#92400e",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
                      }}>
                        {item.type === "ORDER" ? "📦" : item.type === "USER" ? "👤" : "🌾"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>{item.message || item.description || "—"}</div>
                        {item.createdAt && (
                          <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{new Date(item.createdAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: "80px", textAlign: "center", color: "#999", background: "white", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
            <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>No report data available</div>
            <div style={{ fontSize: "14px" }}>Make sure your backend <code>/api/admin/reports</code> endpoint is returning data</div>
          </div>
        )}
      </div>
    </div>
  );
}