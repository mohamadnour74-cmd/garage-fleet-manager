mport { FleetItem } from "../types";

// دالة وهمية لتحليل الأعطال بدون استخدام أي API خارجي
export const analyzeMaintenanceIssue = async (
  vehicle: FleetItem,
  issueDescription: string
): Promise<{ diagnosis: string; steps: string[] }> => {
  // جواب بسيط ثابت، بس لحتى التطبيق يشتغل بدون ما يطيح
  return {
    diagnosis:
      "AI analysis is not configured yet. Please rely on your mechanical experience for now.",
    steps: [
      "Check the basic items first (fluids, filters, visible leaks).",
      "Read any available fault codes from the vehicle/equipment.",
      "Inspect the area related to the described issue.",
      "Plan the repair and record it in the maintenance log.",
    ],
  };
};
