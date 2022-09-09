import swapiGetter from "../try/try";
import mockAxios from "axios";

jest.mock("axios");
mockAxios.get.mockResolvedValue({ data: { name: "Luke Skywalker" } });

afterEach(jest.clearAllMocks);

test("should return name", async () => {
  const res = await swapiGetter(1);
  expect(res).toEqual("Luke Skywalker");
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
});

test("duplicate test", async () => {
  const res = await swapiGetter(1);
  expect(res).toEqual("Luke Skywalker");
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
});
