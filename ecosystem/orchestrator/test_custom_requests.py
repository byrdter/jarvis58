#!/usr/bin/env python3
"""
Test IntentRecognizer with Terry's custom requests
"""

from pathlib import Path
from intent_recognizer import IntentRecognizer

def main():
    # Initialize recognizer
    registry_path = Path(__file__).parent.parent / "registry" / "apps.json"
    recognizer = IntentRecognizer(str(registry_path))

    # Terry's test requests
    test_requests = [
        "Find me the best ETF to buy right now",
        "Get today AI news",
        "Create a Youtube promotion packet for Observability",
    ]

    print("🧠 JARVIS Brain - Testing Terry's Requests\n")
    print("=" * 70)

    for i, request in enumerate(test_requests, 1):
        intent = recognizer.recognize(request)

        print(f"\n{i}. Request: \"{request}\"")
        print(f"   {'─' * 66}")

        if intent.confidence > 0:
            print(f"   ✅ MATCHED: {intent.capability_name}")
            print(f"   📱 App: {intent.matched_app}")
            print(f"   🏷️  Domain: {intent.domain}")
            print(f"   📊 Confidence: {intent.confidence:.0%}")
            print(f"   🔑 Keywords: {', '.join(intent.keywords_matched)}")

            # Quality assessment
            if intent.confidence >= 0.80:
                print(f"   ⭐ Quality: EXCELLENT - High confidence, will route directly")
            elif intent.confidence >= 0.50:
                print(f"   ⚠️  Quality: GOOD - Medium confidence, may confirm first")
            elif intent.confidence >= 0.30:
                print(f"   ⚠️  Quality: FAIR - Low confidence, will ask for clarification")
            else:
                print(f"   ❌ Quality: POOR - Very low confidence, may show options")
        else:
            print(f"   ❌ NO MATCH FOUND")
            print(f"   💡 Suggestion: Check available capabilities or rephrase")

    print("\n" + "=" * 70)
    print("\n📋 Analysis Complete!")

    # Show relevant capabilities for each domain
    print("\n💡 Related Capabilities Available:\n")

    print("INVESTMENTS:")
    inv_caps = recognizer.get_capabilities_by_domain("investments")
    for cap in inv_caps:
        print(f"  • {cap['capability_name']}")
        print(f"    Keywords: {', '.join(cap['keywords'][:5])}...")

    print("\nRESEARCH:")
    research_caps = recognizer.get_capabilities_by_domain("research")
    for cap in research_caps:
        print(f"  • {cap['capability_name']}")
        print(f"    Keywords: {', '.join(cap['keywords'][:5])}...")

    print("\nCONTENT:")
    content_caps = recognizer.get_capabilities_by_domain("content")
    for cap in content_caps[:3]:  # Show first 3
        print(f"  • {cap['capability_name']}")
        print(f"    Keywords: {', '.join(cap['keywords'][:5])}...")

if __name__ == "__main__":
    main()
