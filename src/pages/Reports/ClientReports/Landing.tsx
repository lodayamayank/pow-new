import React, { useEffect, useState } from "react";
import moment from "moment";
import { ApplicationLayout } from "@/components";
import { Client } from "@/pages/Clients/core/_models";
import { getRecords as getClientsRecords } from "@/pages/Clients/core/_requests";
import { getAnnualReportAPI } from "@/pages/Reports/core/_requests";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


/* ================= TYPES ================= */

type AnnualStats = {
  netProfit_Fno_Adj_Etf: number;
  netProfit_Fno_Adj: number;
  fnoProfit: number;
  etfProfit: number;
  adjustments: number;
};

type ClientYearReportRow = {
  period: string;
  totalProfitTillDate: number;
  roi: number;
  quantiply: string;
  settledProfits: number;
  fees: number;
  unsettledProfit: number;
  unsettledPercent: number;
  drawdown: number;
  drawdownPercent: number;
  broker: string;
  family: string;
  partyCode: string;
  clientName: string;
  aum: number;
  roiWeekly: number;
  roiMonthly: number;
  roiYtd: number;
  totalForMonth: number; 
  totalProfit: number;
  weekProfit: number;
  annual: Record<string, AnnualStats>[];

};

/* ================= HELPERS ================= */

function getFyStartEndFromDate(date: string) {
  const d = moment(date);
  const fyStart =
    d.month() < 3
      ? moment(`${d.year() - 1}-04-01`)
      : moment(`${d.year()}-04-01`);
  const fyEnd = fyStart.clone().add(1, "year").subtract(1, "day");

  return {
    start: fyStart.format("DD-MM-YYYY"),
    end: fyEnd.format("DD-MM-YYYY"),
  };
}

function percent(val: number, total: number) {
  if (!total) return 0;
  return Number(((val / total) * 100).toFixed(2));
}

function exportAnnualReportToExcel(
  clientReports: Record<string, ClientYearReportRow>
) {
  if (!clientReports || Object.keys(clientReports).length === 0) {
    alert("No data available to export");
    return;
  }

  // 1. Get the list of years (e.g., ["202122", "202223", ...])
  const financialYears = getFinancialYears(2021);

  const rows = Object.values(clientReports).map((row) => {
    // 2. Define the static columns first
    // We use Record<string, any> to allow adding dynamic keys later
    const rowData: Record<string, any> = {
      "Client Name": row.clientName,
      "AUM": row.aum,
      "Total Profit Till Date": row.totalProfitTillDate,
      "Settled Profits": row.settledProfits,
      "Unsettled Profit": row.unsettledProfit,
      "Drawdown": row.drawdown,
      "Party Code": row.partyCode,
      "Broker": row.broker,
      "ROI Weekly (%)": row.roiWeekly,
      "ROI Monthly (%)": row.roiMonthly,
      "ROI YTD (%)": row.roiYtd,
    };

    // 3. Dynamically add the Net Profit columns
    financialYears.forEach((fy) => {
      // fy is like "202122". We need to format it to "Net Profit FY 21-22"
      const yearStart = fy.substring(2, 4); // "21"
      const yearEnd = fy.substring(4, 6);   // "22"
      const header = `Net Profit FY ${yearStart}-${yearEnd}`;

      // Find the specific year record in the annual array
      const annualRecord = row.annual.find((r) => r[fy]);

      // Extract netProfit if found, otherwise 0
      rowData[header] = annualRecord ? annualRecord[fy].netProfit_Fno_Adj : 0;
    });

    return rowData;
  });

  // 4. Generate Sheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto column width
  const columnWidths = Object.keys(rows[0]).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((r: any) => String(r[key] ?? "").length)
    ),
  }));
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Annual Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",  
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Annual_Client_Report_${moment().format("YYYY-MM-DD")}.xlsx`);
}

function getFinancialYears(startFY: number): string[] {
  const today = moment();

  // If today is before April, current FY started last year
  const currentFYStartYear =
    today.month() < 3 ? today.year() - 1 : today.year();

  const years: string[] = [];

  for (let year = startFY; year <= currentFYStartYear; year++) {
    const fy = `${year}${(year + 1).toString().slice(2)}`;
    years.push(fy);
  }

  return years;
}



async function loadAnnualReports(
  clients: Client[],
  clientDate: string
): Promise<Record<string, ClientYearReportRow>> {

  const financialYears = getFinancialYears(2021);

  const payload = {
    clients: clients.map(c => ({ clientId: c.uuid })),
    financialYears,
  };

  const res = await getAnnualReportAPI(payload);

  if (!res || (res.status !== 200 && res.status !== 201)) {
    throw new Error("Annual report API failed");
  }

  const data: any[] = Array.isArray(res.data) ? res.data : [];

  const reports: Record<string, ClientYearReportRow> = {};

  for (const item of data) {
    if (!item || !item.currentFY || !item.annual) continue;

    const currentFY = item.currentFY;
    const fyData = item.annual[currentFY];

    if (!fyData) continue;

    const aum = fyData.aum || 0;
    const netProfit = fyData.netProfit_Fno_Adj || 0;
    const settled = fyData.settledProfits || 0;

    const diff = netProfit - settled;
    const drawdown = diff < 0 ? diff : 0;
    const unsettled = diff > 0 ? diff : 0;

    const fyStart =
      moment(clientDate).month() < 3
        ? moment(`${moment(clientDate).year() - 1}-04-01`)
        : moment(`${moment(clientDate).year()}-04-01`);

    const fyEnd = fyStart.clone().add(1, "year").subtract(1, "day");

    reports[item.clientCode] = {

      period: `${fyStart.format("DD-MM-YYYY")} TO ${fyEnd.format("DD-MM-YYYY")}`,
      totalProfitTillDate: item.totalProfitTillDate || 0,
      roi: fyData.roiYtd || 0,
      quantiply: "-",

      settledProfits: settled,
      fees: 0,

      unsettledProfit: unsettled,
      unsettledPercent: aum ? Number(((unsettled / aum) * 100).toFixed(2)) : 0,

      drawdown,
      drawdownPercent: aum ? Number(((drawdown / aum) * 100).toFixed(2)) : 0,

      broker: item.broker || "-",
      family: "-",
      partyCode: item.clientCode || "-",
      clientName: item.clientName || "-",

      aum,

      roiWeekly: fyData.roiWeekly || 0,
      roiMonthly: fyData.roiMonthly || 0,
      totalForMonth: fyData.monthProfit || 0,
      roiYtd: fyData.roiYtd || 0,

      totalProfit: item.totalProfitTillDate || 0,
      weekProfit: fyData.weekProfit || 0,

      // Mapping Net Profits from the nested Annual Object
      annual: Object.entries(item.annual || {}).map(([year, stats]) => ({
        [year]: stats as AnnualStats,
      })),

    };
  }

  return reports;
}




/* ================= MAIN COMPONENT ================= */

export default function AnnualReport() {
  const [clients, setClients] = useState<Client[]>([]);
  const financialYears = getFinancialYears(2021);
  const [clientReports, setClientReports] = useState<
    Record<string, ClientYearReportRow>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getClientsRecords();
        const recordsList: Client[] = res?.data || [];
        setClients(recordsList);

        if (!recordsList.length) return;

        const reports = await loadAnnualReports(recordsList, currentDate);
        setClientReports(reports);
      } catch (err) {
        console.error("Failed to load annual report", err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [currentDate]);


const weeklyStart = moment().subtract(1, 'weeks').startOf('isoWeek');
const weeklyEnd = weeklyStart.clone().add(5, 'days');
const weeklyPeriod = `${weeklyStart.format(
  "DD-MM-YYYY"
)} TO ${weeklyEnd.format("DD-MM-YYYY")} - As per Weekly report date`;

  /* ================= UI ================= */

  return (
    <ApplicationLayout>
      <main className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Annual Client Report</h3>
              <div className="text-muted">
                Total Clients: {clients.length} | Loaded:{" "}
                {Object.keys(clientReports).length}
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={() => exportAnnualReportToExcel(clientReports)}
                >
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  Export Excel
                </button>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-1"></i>
                  Print
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" />
                <div className="mt-2">Loading Annual Report…</div>
              </div>
            ) : (
              <div className="card-body p-0 table-responsive">
                <table className="table table-bordered table-striped mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Client</th>
                      {financialYears.map(fy => (
                        <th key={fy}>NP FY {fy.slice(0, 2)}-{fy.slice(2)}</th>
                      ))}
                      <th>Total Profit</th>
                      <th>Settled</th>
                      <th>Unsettled</th>
                      <th>Drawdown</th>
                      <th>AUM</th>
                      <th>ROI YTD</th>
                      <th>ROI Monthly</th>
                      <th>ROI Weekly</th>
                      <th>{weeklyPeriod}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(clientReports).map(r => (
                      <tr key={r.partyCode}>
                        <td>{r.clientName}</td>
                        {financialYears.map(fy => (
                          <td key={fy}>
                            {(() => {
                              const yearRecord = r.annual.find((item) => item[fy]);
                              const val = yearRecord ? yearRecord[fy].netProfit_Fno_Adj : 0;
                              return val.toLocaleString("en-IN");
                            })()}
                          </td>
                        ))}
                        <td>{r.totalProfitTillDate.toLocaleString("en-IN")}</td>
                        <td>{r.settledProfits.toLocaleString("en-IN")}</td>
                        <td>{r.unsettledProfit.toLocaleString("en-IN")}</td>
                        <td>{r.drawdown.toLocaleString("en-IN")}</td>
                        <td>{r.aum.toLocaleString("en-IN")}</td>
                        <td>{r.roiYtd.toFixed(2)}%</td>
                        <td>{r.roiMonthly.toFixed(2)}%</td>
                        <td>{r.roiWeekly.toFixed(2)}%</td>
                        <td>{r.weekProfit.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </ApplicationLayout>
  );
}
