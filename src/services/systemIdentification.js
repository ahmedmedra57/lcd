export const getNoLinkedBlowerDevices = async () => {
  try {
    const response = await fetch(
      "https://api.dev.umb-360.com/api/blowers?status=NOT_LINKED"
    )
    return response.json()
  } catch (error) {
    return []
  }
}
export const getNoLinkedElectricalDevices = async () => {
  try {
    const response = await fetch(
      "https://api.dev.umb-360.com/api/switches?status=NOT_LINKED"
    )
    return response.json()
  } catch (error) {
    return []
  }
}
export const getHeaters = async () => {
  try {
    const response = await fetch(
      "https://api.dev.umb-360.com/api/heaters/search"
    )
    return response.json()
  } catch (error) {
    return []
  }
}
