#!/bin/bash

# List of all API routes that use Prisma
routes=(
    "app/api/refund/request/route.ts"
    "app/api/admin/admins/[id]/route.ts"
    "app/api/admin/insurance-providers/[id]/route.ts"
    "app/api/quiz/submit/route.ts"
    "app/api/user/me/route.ts"
    "app/api/admin/admins/route.ts"
    "app/api/admin/refunds/route.ts"
    "app/api/admin/me/route.ts"
    "app/api/admin/dashboard/route.ts"
    "app/api/user/profile/route.ts"
    "app/api/admin/refunds/[id]/route.ts"
    "app/api/admin/users/route.ts"
    "app/api/admin/users/[id]/route.ts"
    "app/api/admin/quiz/[id]/route.ts"
    "app/api/admin/plans/route.ts"
    "app/api/admin/plans/[id]/route.ts"
    "app/api/admin/auth/login/route.ts"
    "app/api/user/password/route.ts"
    "app/api/admin/insurance-providers/route.ts"
    "app/api/admin/subscriptions/[id]/route.ts"
    "app/api/admin/quiz/route.ts"
    "app/api/admin/contact/route.ts"
    "app/api/admin/subscriptions/route.ts"
    "app/api/admin/plans/reorder/route.ts"
    "app/api/user/subscription/route.ts"
    "app/api/payment/create-order/route.ts"
    "app/api/payment/verify/route.ts"
    "app/api/admin/payments/route.ts"
    "app/api/auth/check-registration/route.ts"
    "app/api/auth/login/route.ts"
    "app/api/auth/verify-firebase/route.ts"
    "app/api/webhooks/razorpay/route.ts"
    "app/api/user/subscription/auto-renew/route.ts"
    "app/api/contact/route.ts"
    "app/api/auth/forgot-password/verify/route.ts"
    "app/api/auth/forgot-password/reset/route.ts"
    "app/api/auth/forgot-password/request/route.ts"
)

# Process each route
for route in "${routes[@]}"; do
    file="$route"
    
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "File not found: $file"
        continue
    fi
    
    # Check if runtime declaration already exists
    if grep -q "export const runtime" "$file"; then
        echo "Runtime already exists in: $file"
        continue
    fi
    
    # Add runtime declaration at the beginning
    echo "Adding runtime to: $file"
    
    # Create temporary file
    temp_file=$(mktemp)
    
    # Add runtime declaration at the top
    echo "export const runtime = 'nodejs';" > "$temp_file"
    echo "" >> "$temp_file"
    
    # Append the rest of the file
    cat "$file" >> "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
done

echo "Done!"
