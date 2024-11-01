import { Bar, BarChart, Pie, PieChart } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { ExpandedList } from "@/lib/types";
import { WeightConvertible } from "@/lib/convertible";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const ListWeightChart: React.FC<{ list: ExpandedList }> = ({ list }) => {
  const chartData = list.categories.map((category) => ({
    name: category.name,
    weight: category.items.reduce(
      (acc, val) =>
        acc +
        WeightConvertible.convert(
          val.itemData.weight,
          val.itemData.weightUnit,
          list.weightUnit,
        ),
      0,
    ),
    quantity: category.items.reduce((acc, val) => acc + val.quantity, 0),
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
      <PieChart accessibilityLayer data={chartData}>
        <Pie dataKey="weight" data={chartData} label />
      </PieChart>
    </ChartContainer>
  );
};

export default ListWeightChart;
