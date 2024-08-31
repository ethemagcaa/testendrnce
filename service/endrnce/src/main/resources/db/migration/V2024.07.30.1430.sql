INSERT IGNORE INTO health_check_vendor (id, name, url, period, status) VALUES (1, 'Stripe', 'https://api.stripe.com', 900000, 1);

INSERT INTO health_check_vendor (id, name, url, period, status) VALUES (NULL, 'Paypal', 'https://api-m.sandbox.paypal.com', 900000, 1);

SET @LASTIDINVENDOR = LAST_INSERT_ID();

TRUNCATE TABLE health_check_environment;
INSERT INTO health_check_environment (id, health_check_vendor_id, environment_key, environment_value)
VALUES  (NULL, 1, 'paymentmethod_id', 'pm_1Pfddb2LXydoAc7GCGFJrulM'),
        (NULL, 1, 'customer_id', 'cus_QWgzY8HC2i8hMv');

INSERT INTO health_check_endpoint (id, health_check_vendor_id, name, period, path, request_type, request_payload, request_header, next_run_time, status)
VALUES
    (NULL, 1, 'Create a customer', null, 'v1/customers', 'POST', 'name=Jenny Rosen
email=jennyrosen@example.com', '{
  "Authorization": "Bearer sk_test_51PfdGZ2LXydoAc7GJbODWVxBvs4Q1KAcZ4bSMipSjVWVfkhRz6kPUW6yuDLs1cF2Tf1omwH9Kn0kkU7v1AOmFUpT006i6RiY8s",
  "Content-Type": "application/x-www-form-urlencoded"
}', NULL, 1),
    (NULL, 1, 'Attach a PaymentMethod to a Customer', null, 'v1/payment_methods/{{paymentmethod_id}}/attach', 'POST', 'customer={{customer_id}}', '{
  "Authorization": "Bearer sk_test_51PfdGZ2LXydoAc7GJbODWVxBvs4Q1KAcZ4bSMipSjVWVfkhRz6kPUW6yuDLs1cF2Tf1omwH9Kn0kkU7v1AOmFUpT006i6RiY8s",
  "Content-Type": "application/x-www-form-urlencoded"
}', NULL, 1);

INSERT INTO health_check_endpoint (id, health_check_vendor_id, name, period, path, request_type, request_payload, request_header, next_run_time, status) VALUES (NULL, 1, 'Stripe Authorize', NULL, 'charges', 'GET', NULL, '{"Authorization":"Bearer sk_test_51PfdGZ2LXydoAc7GJbODWVxBvs4Q1KAcZ4bSMipSjVWVfkhRz6kPUW6yuDLs1cF2Tf1omwH9Kn0kkU7v1AOmFUpT006i6RiY8s"}', NULL, 1);

INSERT INTO health_check_endpoint (id, health_check_vendor_id, name, period, path, request_type, request_payload, request_header, next_run_time, status) VALUES (NULL, @LASTIDINVENDOR, 'Paypal Authorize', NULL, 'v1/oauth2/token', 'POST', 'grant_type=client_credentials', '{"Authorization":"Basic QWEyYm9BY3ZGVWJZMkxNMTZETTNHbTQ5MEVkSkxwZnFWc2hrb05wRzEzVmxubFdtaTU4Ym55ZmVfdzcwZ1JoNDl3aWZKRjVManljbTdZdm06RU9oM25YWFVfZklscmotVEVqQkpIdU1OOWVzZGJCemVOU2o4Q0hVMmRxcjFOVmtXWWsxUERXTGZ2WHhncXJ6clNKbzFKR0tVbzJkdTdwVnY="}', NULL, 1);

INSERT INTO health_check_endpoint (id, health_check_vendor_id, name, period, path, request_type, request_payload, request_header, next_run_time, status) VALUES (NULL, @LASTIDINVENDOR, 'Paypal Create Order', NULL, 'v2/checkout/orders', 'POST', '{
    "intent": "CAPTURE",
    "purchase_units": [
        {
            "items": [
                {
                    "name": "T-Shirt",
                    "description": "Green XL",
                    "quantity": "1",
                    "unit_amount": {
                        "currency_code": "USD",
                        "value": "100.00"
                    }
                }
            ],
            "amount": {
                "currency_code": "USD",
                "value": "100.00",
                "breakdown": {
                    "item_total": {
                        "currency_code": "USD",
                        "value": "100.00"
                    }
                }
            }
        }
    ],
    "application_context": {
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
    }
}', '{"Authorization":"Basic QWEyYm9BY3ZGVWJZMkxNMTZETTNHbTQ5MEVkSkxwZnFWc2hrb05wRzEzVmxubFdtaTU4Ym55ZmVfdzcwZ1JoNDl3aWZKRjVManljbTdZdm06RU9oM25YWFVfZklscmotVEVqQkpIdU1OOWVzZGJCemVOU2o4Q0hVMmRxcjFOVmtXWWsxUERXTGZ2WHhncXJ6clNKbzFKR0tVbzJkdTdwVnY=","Prefer": "return=representation","PayPal-Request-Id": "943850f8-163d-46ff-8fdb-73a8e5d538ee"}', NULL, 1);

INSERT INTO health_check_endpoint (id, health_check_vendor_id, name, period, path, request_type, request_payload, request_header, next_run_time, status) VALUES (NULL, @LASTIDINVENDOR, 'Paypal Create Batch Payout', NULL, 'v1/payments/payouts', 'POST', '{
    "sender_batch_header": {
        "sender_batch_id": "Payouts_1722331851",
        "email_subject": "You have a payout!",
        "email_message": "You have received a payout! Thanks for using our service!"
    },
    "items": [
        {
            "recipient_type": "EMAIL",
            "amount": {
                "value": "10.00",
                "currency": "USD"
            },
            "note": "Thanks for your patronage!",
            "sender_item_id": "201403140001",
            "receiver": "Alexander.Bradtke69@hotmail.com",
            "notification_language": "en-US"
        },
        {
            "recipient_type": "PHONE",
            "amount": {
                "value": "20.00",
                "currency": "USD"
            },
            "note": "Thanks for your support!",
            "sender_item_id": "201403140002",
            "receiver": "1-397-909-8992"
        },
        {
            "recipient_type": "PAYPAL_ID",
            "amount": {
                "value": "30.00",
                "currency": "USD"
            },
            "note": "Thanks for your patronage!",
            "sender_item_id": "201403140003",
            "receiver": "5DEJUG27PZB9J"
        }
    ]
}', '{"Authorization":"Basic QWEyYm9BY3ZGVWJZMkxNMTZETTNHbTQ5MEVkSkxwZnFWc2hrb05wRzEzVmxubFdtaTU4Ym55ZmVfdzcwZ1JoNDl3aWZKRjVManljbTdZdm06RU9oM25YWFVfZklscmotVEVqQkpIdU1OOWVzZGJCemVOU2o4Q0hVMmRxcjFOVmtXWWsxUERXTGZ2WHhncXJ6clNKbzFKR0tVbzJkdTdwVnY=","Prefer": "return=representation","PayPal-Request-Id": "51710769-4bee-4d51-9bcd-2e6f354e12d1"}', NULL, 1);
