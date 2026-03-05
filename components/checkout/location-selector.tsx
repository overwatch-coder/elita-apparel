"use client";

import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationSelectorProps {
  country: string;
  state: string;
  city: string;
  onLocationChange: (key: string, value: string) => void;
}

export function LocationSelector({
  country,
  state,
  city,
  onLocationChange,
}: LocationSelectorProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");
  const [showOtherCity, setShowOtherCity] = useState(false);

  useEffect(() => {
    // Get all countries
    const allCountries = Country.getAllCountries();

    // Bubble Ghana to the top
    const ghana = allCountries.find((c) => c.isoCode === "GH");
    const otherCountries = allCountries.filter((c) => c.isoCode !== "GH");

    setCountries(ghana ? [ghana, ...otherCountries] : allCountries);

    // Initial setup if a country is provided
    if (country) {
      const initCountry = allCountries.find((c) => c.name === country);
      if (initCountry) {
        setSelectedCountryCode(initCountry.isoCode);
        const st = State.getStatesOfCountry(initCountry.isoCode);
        setStates(st);

        if (state) {
          const initState = st.find((s) => s.name === state);
          if (initState) {
            setSelectedStateCode(initState.isoCode);
            const fetchedCities = City.getCitiesOfState(
              initCountry.isoCode,
              initState.isoCode,
            );
            setCities(fetchedCities);
            if (fetchedCities.length === 0) {
              setShowOtherCity(true);
            }
          }
        }
      }
    } else if (ghana) {
      // Default to Ghana if no country
      onLocationChange("country", ghana.name);
      setSelectedCountryCode("GH");
      setStates(State.getStatesOfCountry("GH"));
    }
  }, []);

  const handleCountryChange = (name: string) => {
    onLocationChange("country", name);
    onLocationChange("state", "");
    onLocationChange("city", "");

    const countryObj = Country.getAllCountries().find((c) => c.name === name);
    if (countryObj) {
      setSelectedCountryCode(countryObj.isoCode);
      setStates(State.getStatesOfCountry(countryObj.isoCode));
      setSelectedStateCode("");
      setCities([]);
      setShowOtherCity(false);
    }
  };

  const handleStateChange = (name: string) => {
    onLocationChange("state", name);
    onLocationChange("city", "");

    const stateObj = states.find((s) => s.name === name);
    if (stateObj && selectedCountryCode) {
      setSelectedStateCode(stateObj.isoCode);
      const fetchedCities = City.getCitiesOfState(
        selectedCountryCode,
        stateObj.isoCode,
      );
      setCities(fetchedCities);

      if (fetchedCities.length === 0) {
        setShowOtherCity(true);
      } else {
        setShowOtherCity(false);
      }
    }
  };

  const handleCityChange = (name: string) => {
    if (name === "other") {
      setShowOtherCity(true);
      onLocationChange("city", ""); // Reset the actual city value so the user can type it
    } else {
      setShowOtherCity(false);
      onLocationChange("city", name);
    }
  };

  return (
    <>
      <div className="sm:col-span-2">
        <Label htmlFor="country" className="text-muted-foreground">
          Country *
        </Label>
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="mt-1.5 bg-background border-border text-foreground h-12 w-full focus:ring-gold/50">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.isoCode} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="state" className="text-muted-foreground">
          Region/State *
        </Label>
        <Select
          value={state}
          onValueChange={handleStateChange}
          disabled={!selectedCountryCode || states.length === 0}
        >
          <SelectTrigger className="mt-1.5 bg-background border-border text-foreground h-12 w-full focus:ring-gold/50">
            <SelectValue placeholder="Select Region/State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.isoCode} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="city" className="text-muted-foreground">
          City/Town *
        </Label>
        <Select
          value={
            showOtherCity
              ? "other"
              : cities.find((c) => c.name === city)
                ? city
                : city && !showOtherCity
                  ? "other"
                  : ""
          }
          onValueChange={handleCityChange}
          disabled={!selectedStateCode && states.length > 0}
        >
          <SelectTrigger className="mt-1.5 bg-background border-border text-foreground h-12 w-full focus:ring-gold/50">
            <SelectValue
              placeholder={
                cities.length > 0 ? "Select City/Town" : "Select an option"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
            <SelectItem value="other" className="font-medium text-gold">
              Other
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showOtherCity && (
        <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-1">
          <Label htmlFor="custom-city" className="text-muted-foreground">
            Enter City/Town Name *
          </Label>
          <Input
            id="custom-city"
            value={city}
            onChange={(e) => onLocationChange("city", e.target.value)}
            className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
            placeholder="e.g. Tesano"
            required
            autoFocus
          />
        </div>
      )}
    </>
  );
}
