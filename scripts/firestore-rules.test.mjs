import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const projectId = "demo-kira-rules";
const rules = readFileSync("firestore.rules", "utf8");
const env = await initializeTestEnvironment({
  projectId,
  firestore: { rules, host: "127.0.0.1", port: 8080 },
});
const now = Timestamp.now();

try {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "courses", "paid-course"), {
      title: "Curso de prueba",
      description: "Curso de pago",
      price: 99,
      coachId: "coach-owner",
      status: "published",
      createdAt: now,
    });
    await setDoc(doc(db, "journals", "private-student"), {
      userId: "student-owner",
      content: "Entrada privada",
      createdAt: now,
    });
    await setDoc(doc(db, "journals", "own-student"), {
      userId: "student-a",
      content: "Mi entrada",
      createdAt: now,
    });
    await setDoc(doc(db, "users", "student-a"), {
      uid: "student-a",
      email: "student@example.test",
      role: "alumno",
      approvalStatus: "approved",
      createdAt: now,
    });
  });

  const applicantDb = env.authenticatedContext("new-coach", {
    email: "coach@example.test",
    email_verified: true,
  }).firestore();

  await assertFails(setDoc(doc(applicantDb, "users", "new-coach"), {
    uid: "new-coach",
    email: "coach@example.test",
    role: "coach",
    requestedRole: "coach",
    approvalStatus: "approved",
    createdAt: now,
  }));

  await assertSucceeds(setDoc(doc(applicantDb, "users", "new-coach"), {
    uid: "new-coach",
    email: "coach@example.test",
    role: "alumno",
    requestedRole: "coach",
    approvalStatus: "pending",
    createdAt: now,
    points: 0,
  }));

  const studentDb = env.authenticatedContext("student-a", {
    email: "student@example.test",
    email_verified: true,
  }).firestore();

  await assertSucceeds(getDoc(doc(studentDb, "journals", "own-student")));
  await assertFails(getDoc(doc(studentDb, "journals", "private-student")));

  await assertFails(setDoc(doc(studentDb, "sales", "fake-sale"), {
    userId: "student-a",
    amount: 1,
    status: "paid",
  }));

  await assertFails(setDoc(doc(studentDb, "transactions", "fake-transaction"), {
    userId: "student-a",
    amount: 1,
    status: "paid",
  }));

  await assertFails(setDoc(doc(studentDb, "enrollments", "unpaid-enrollment"), {
    userId: "student-a",
    courseId: "paid-course",
    progress: 0,
    createdAt: now,
  }));

  await assertFails(getDoc(doc(studentDb, "settings", "private-config")));
  await assertSucceeds(getDoc(doc(studentDb, "settings", "website")));

  console.log("Firestore security rules tests passed.");
} finally {
  await env.cleanup();
}
