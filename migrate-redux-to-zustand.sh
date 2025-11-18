#!/bin/bash

# Redux to Zustand Migration Script
# This script automates the migration of React components from Redux to Zustand

echo "Starting Redux to Zustand migration..."

# Find all files with react-redux imports
FILES=$(find src -name "*.js" -exec grep -l "from ['\"']react-redux['\"']" {} \; 2>/dev/null)

# Migration patterns
declare -A SLICE_TO_STORE=(
  ["selectUserState"]="useUserStore"
  ["userSlice"]="useUserStore"
  ["selectHeaterStatus"]="useHeaterStatusStore"
  ["heaterStatusSlice"]="useHeaterStatusStore"
  ["selectEssSwitch"]="useEssSwitchStore"
  ["essSwitchSlice"]="useEssSwitchStore"
  ["selectTgsSwitch"]="useTgsSwitchStore"
  ["tgsSwitchSlice"]="useTgsSwitchStore"
  ["selectFaults"]="useFaultsStore"
  ["faultsSlice"]="useFaultsStore"
  ["selectChartState"]="useChartStore"
  ["chartSlice"]="useChartStore"
  ["selectTimerState"]="useTimerStore"
  ["timerSlice"]="useTimerStore"
  ["selectForceAndCommandState"]="useForceAndCommandStore"
  ["forceAndCommandSlice"]="useForceAndCommandStore"
  ["selectSettingsOfEss"]="useSettingsStore"
  ["settingsOfEssSlice"]="useSettingsStore"
  ["selectUnitsState"]="useSettingsStore"
  ["unitsSlice"]="useSettingsStore"
  ["selectSettingsOfTgsTes"]="useTgsSettingsStore"
  ["settingsOfTgsTesSlice"]="useTgsSettingsStore"
  ["selectSystemIdentification"]="useSystemIdentificationStore"
  ["settingsSystemIdentificationSlice"]="useSystemIdentificationStore"
  ["selectSsrDescription"]="useHeaterStatusStore"
  ["ssrDescriptionSlice"]="useHeaterStatusStore"
)

# Counter
MIGRATED=0
FAILED=0

for file in $FILES; do
  echo "Processing: $file"

  # Backup original file
  cp "$file" "$file.backup"

  # Check if file needs migration
  if grep -q "useDispatch\|useSelector" "$file"; then
    echo "  - Migrating Redux hooks to Zustand..."

    # Note: Manual review required for complex cases
    # This script identifies files that need migration
    echo "  - File needs manual migration or automated sed script"
    ((FAILED++))
  fi
done

echo ""
echo "Migration Summary:"
echo "  Files processed: $(echo "$FILES" | wc -l)"
echo "  Successfully migrated: $MIGRATED"
echo "  Needs manual review: $FAILED"
echo ""
echo "Files requiring migration:"
echo "$FILES"
