import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const downloadReportAsPdf = (report: any) => {
  const doc = new jsPDF();
  const margin = 15;

  let lastY = 0;

  doc.setFontSize(16);
  doc.text("Laporan Proctoring", doc.internal.pageSize.getWidth() / 2, margin, {
    align: "center"
  });
  doc.setFontSize(12);
  doc.text(
    report.event.code,
    doc.internal.pageSize.getWidth() / 2,
    margin + 8,
    { align: "center" }
  );
  lastY = margin + 8;

  autoTable(doc, {
    startY: lastY + 5,
    body: [
      ["Klien", `: ${report.event.client.name}`],
      ["Tanggal", `: ${dayjs(report.event.date).format("D MMMM YYYY")}`],
      ["Waktu", `: ${report.event.start_time} - ${report.event.finish_time}`]
    ],
    theme: "plain",
    styles: { fontSize: 9 },

    didDrawPage: (data) => {
      if (data.cursor) lastY = data.cursor.y;
    }
  });

  autoTable(doc, {
    startY: lastY + 5,
    head: [["Statistik Peserta", "Jumlah"]],
    body: [
      ["Peserta Login", report.number_of_participants_logged_in || 0],
      [
        "Peserta Hanya Login",
        report.number_of_participants_only_logged_in || 0
      ],
      ["Peserta Selesai", report.number_of_participants_completed || 0],
      [
        "Peserta Tidak Selesai",
        report.number_of_participants_not_completed || 0
      ]
    ],
    theme: "striped",
    headStyles: { fillColor: [14, 29, 84] },

    didDrawPage: (data) => {
      if (data.cursor) lastY = data.cursor.y;
    }
  });

  if (report.participantNotLoggedIns?.length) {
    autoTable(doc, {
      startY: lastY + 10,
      head: [["Peserta Tidak Login"]],
      body: report.participantNotLoggedIns.map((p: any) => [
        p.participant.name
      ]),
      theme: "striped",
      headStyles: { fillColor: [14, 29, 84] },
      didDrawPage: (data) => {
        if (data.cursor) lastY = data.cursor.y;
      }
    });
  }

  if (report.reportIssues?.length) {
    const startY = lastY + 15;
    doc.setFontSize(11).text("Kendala Peserta", margin, startY);
    autoTable(doc, {
      startY: startY + 5,
      head: [
        ["Nama Peserta", "Kendala", "Tindak lanjut", "Respon", "Keterangan"]
      ],
      body: report.reportIssues.map((i: any) => [
        i.participant.name,
        i.issue_type,
        i.issue_action,
        i.participant_issue_response,
        i.remarks
      ]),
      headStyles: { fillColor: [14, 29, 84] },
      didDrawPage: (data) => {
        if (data.cursor) lastY = data.cursor.y;
      }
    });
  }

  if (report.reportViolations?.length) {
    const startY = lastY + 15;
    doc.setFontSize(11).text("Indikasi Pelanggaran", margin, startY);
    autoTable(doc, {
      startY: startY + 5,
      head: [
        [
          "Nama Peserta",
          "Detail Kejadian",
          "Tindak Lanjut Proctor",
          "Respon Peserta"
        ]
      ],
      body: report.reportViolations.map((v: any) => {
        const violationDetails = v.reportViolationDetails
          ?.map(
            (d: any) =>
              `${d.period}x - [${d.violation.level}] ${d.violation.condition}`
          )
          .join("\n");
        return [
          v.participant.name,
          violationDetails || "Tidak ada detail",
          v.violation_action,
          v.participant_violation_response
        ];
      }),
      headStyles: { fillColor: [14, 29, 84] },
      styles: { cellPadding: 2, fontSize: 8 },
      didDrawPage: (data) => {
        if (data.cursor) lastY = data.cursor.y;
      }
    });
  }

  doc.save(`Report-${report.event.code}.pdf`);
};
