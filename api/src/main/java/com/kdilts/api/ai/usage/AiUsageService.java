package com.kdilts.api.ai.usage;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.kdilts.api.ai.config.AiProperties;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiUsageService {

    private static final DateTimeFormatter DAY_KEY = DateTimeFormatter.BASIC_ISO_DATE; // yyyyMMdd

    private final Firestore firestore;
    private final AiProperties props;

    public AiUsageService(Firestore firestore, AiProperties props) {
        this.firestore = firestore;
        this.props = props;
    }

    /** Atomically increments the caller's daily usage counter. */
    public int incrementDailyRunsOrThrow(String uid) {
        // Unlimited allowlist (v1: config-driven; v2: move to Firestore)
        if (props.unlimitedUids() != null && props.unlimitedUids().contains(uid)) {
            return -1; // sentinel: unlimited
        }

        int limit = props.dailyRunLimitDefault();
        String day = LocalDate.now(ZoneOffset.UTC).format(DAY_KEY);

        DocumentReference ref = firestore
            .collection("users")
            .document(uid)
            .collection("usage")
            .document("aiRuns_" + day);

        try {
            return firestore.runTransaction(tx -> {
                DocumentSnapshot snap = tx.get(ref).get();
                long current = 0;
                if (snap.exists()) {
                    Object c = snap.get("count");
                    if (c instanceof Number n) current = n.longValue();
                }

                if (current >= limit) throw new DailyLimitExceededException(limit);

                long next = current + 1;
                Map<String, Object> updates = new HashMap<>();
                updates.put("count", next);
                updates.put("updatedAt", Timestamp.now());
                if (!snap.exists()) updates.put("createdAt", Timestamp.now());

                tx.set(ref, updates, com.google.cloud.firestore.SetOptions.merge());
                return (int) next;
            }).get();
        } catch (java.util.concurrent.ExecutionException e) {
            if (e.getCause() instanceof DailyLimitExceededException dle) throw dle;
            throw new RuntimeException("Failed to update usage counter", e.getCause());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted updating usage counter", e);
        }
    }
}
