"use client";
import { Loader2, Search } from "lucide-react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import { defaultLocation } from "@/lib/mock-data";
interface LocationSearchProps {
  onLocationSelect: (address: string) => void;
  isFetchingForecast: boolean;
}
export default function LocationSearch({
  onLocationSelect,
  isFetchingForecast,
}: LocationSearchProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
    defaultValue: defaultLocation,
  });
  const handleSelectSuggestion = (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    setValue(suggestion.description, false);
    clearSuggestions();
    onLocationSelect(suggestion.description);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <Input
        type="text"
        placeholder="Search by location..."
        className="w-full pl-10"
        value={value}
        onChange={handleInputChange}
        disabled={!ready}
      />
      {isFetchingForecast && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
      )}
      {status === "OK" && (
        <div className="absolute top-full mt-1 w-full bg-card border rounded-md shadow-lg z-20">
          <ul className="py-1">
            {data.map((suggestion) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = suggestion;
              return (
                <li
                  key={place_id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                >
                  <span className="font-semibold">{main_text}</span>
                  {secondary_text && (
                    <span className="text-muted-foreground ml-2">
                      {secondary_text}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
