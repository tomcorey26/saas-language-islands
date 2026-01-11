import { describe, it, expect, vi, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import * as userDb from "@/server/db/users";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

// Mock the database
vi.mock("@/drizzle/db", () => ({
  db: {
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    batch: vi.fn(),
    query: {
      UserTable: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe("User Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("inserts a new user with onConflictDoNothing", () => {
      const mockValues = vi.fn().mockReturnThis();
      const mockOnConflictDoNothing = vi.fn();

      (db.insert as any).mockReturnValue({
        values: mockValues,
      });

      mockValues.mockReturnValue({
        onConflictDoNothing: mockOnConflictDoNothing,
      });

      const userData = {
        clerkUserId: "user_123",
        tokensBalance: 100,
      };

      userDb.createUser(userData);

      expect(db.insert).toHaveBeenCalledWith(UserTable);
      expect(mockValues).toHaveBeenCalledWith(userData);
      expect(mockOnConflictDoNothing).toHaveBeenCalledWith({
        target: UserTable.clerkUserId,
      });
    });
  });

  describe("getUser", () => {
    it("finds a user by clerkUserId", async () => {
      const mockUser = {
        id: 1,
        clerkUserId: "user_123",
        tokensBalance: 100,
      };

      (db.query.UserTable.findFirst as any).mockResolvedValue(mockUser);

      const result = await userDb.getUser("user_123");

      expect(db.query.UserTable.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe("updateUser", () => {
    it("updates a user and returns updated data", async () => {
      const mockReturning = vi.fn().mockResolvedValue([
        { id: 1, clerkUserId: "user_123" },
      ]);
      const mockWhere = vi.fn().mockReturnValue({
        returning: mockReturning,
      });
      const mockSet = vi.fn().mockReturnValue({
        where: mockWhere,
      });

      (db.update as any).mockReturnValue({
        set: mockSet,
      });

      const whereClause = eq(UserTable.clerkUserId, "user_123");
      const updateData = { tokensBalance: 200 };

      const result = await userDb.updateUser(whereClause, updateData);

      expect(db.update).toHaveBeenCalledWith(UserTable);
      expect(mockSet).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: 1, clerkUserId: "user_123" });
    });
  });

  describe("deleteUser", () => {
    it("deletes user and their decks in a batch", () => {
      (db.batch as any).mockResolvedValue([]);

      userDb.deleteUser("user_123");

      expect(db.batch).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
