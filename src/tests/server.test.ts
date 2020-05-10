import config from "../../build/server"

test("testing config", () => {
  expect(config.saltRounds).toBeGreaterThanOrEqual(12)
})
