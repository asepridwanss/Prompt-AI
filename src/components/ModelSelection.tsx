import useSWR from "swr";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });
const fetchModels = () => fetch("/api/engines").then(res => res.json());

const ModelSelection = () => {
  const { data: models } = useSWR("models", fetchModels);
  const { data: model, mutate } = useSWR("model", {
    fallbackData: "gpt-4o",
  });

  return (
    <Select
      isSearchable
      options={models?.modelOptions}
      defaultValue={{ value: model, label: model }}
      placeholder="Select model"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(e: any) => mutate(e.value)}
      styles={{
        control: base => ({ ...base, borderColor: "#2076c9", backgroundColor: "transparent" }),
        singleValue: base => ({ ...base, color: "#2076c9" }),
        placeholder: base => ({ ...base, color: "#2076c9" }),
        input: base => ({ ...base, color: "#2076c9" }),
      }}
    />
  );
};

export default ModelSelection;
